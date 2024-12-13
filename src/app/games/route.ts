import { isBlank } from "@/utils/str";
import { createClient } from "@supabase/supabase-js";
import { Database, Tables } from "@/model/database.types";
import dayjs from "dayjs";
import { GameListResponse, steamDict } from "@/model/steam";

export async function GET() {
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_KEY || "";
  if (isBlank(url, key)) {
    return new Response("缺少配置，请查看 supabaseUrl、supabaseKey 是否完整", {
      status: 400,
      headers: { "Access-Control-Allow-Origin": "https://lyp.ink", "Content-Type": "application/json; charset=utf-8" },
    });
  }

  const id = process.env.STEAM_ID || "";
  const token = process.env.STEAM_TOKEN || "";
  if (isBlank(id, token)) {
    return new Response("缺少配置，请查看 steamToken、steamId 是否完整", {
      status: 400,
      headers: { "Access-Control-Allow-Origin": "https://lyp.ink", "Content-Type": "application/json; charset=utf-8" },
    });
  }
  const steamRecentlyURL = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1?key=${token}&steamid=${id}`;

  const supabase = createClient<Database>(url, key);

  try {
    const { data, error } = await supabase.from("lyp-steam-games").select("*");

    if (error) {
      console.error(error);
      return new Response(error.message, {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "https://lyp.ink",
          "Content-Type": "application/json; charset=utf-8",
        },
      });
    }

    if (data != null && data.length > 0) {
      const pastDate = dayjs(data[0].updated_time);
      const over1day = dayjs().diff(pastDate, "day") >= 0.5;
      if (!over1day) {
        return new Response(JSON.stringify({ data: data, from: "database" }), {
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "https://lyp.ink",
            "Content-Type": "application/json; charset=utf-8",
          },
        });
      }
    }

    const result = await fetch(steamRecentlyURL);
    const gameList: GameListResponse = await result.json();


    const current = new Date();

    const finalList: Tables<"lyp-steam-games">[] = gameList.response.games.map((game, idx) => {
      // 检查字典B中是否有对应的appid，并更新name字段
      return {
        id: idx + 1,
        game_id: String(game.appid) || "",
        name: game.name || "",
        name_cn: steamDict[game.appid || 0] || game.name || "",
        play_time: String(game.playtime_forever) || "",
        play_time_2weeks: String(game.playtime_2weeks) || "",
        updated_time: current.toISOString() || "",
      };
    });

    await supabase.from("lyp-steam-games").delete().gt("id", "0").select();
    await supabase.from("lyp-steam-games").insert(finalList).select();

    return new Response(JSON.stringify({ data: finalList, from: "steam" }), {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "https://lyp.ink", "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (err) {
    console.error(err);
    return new Response(err instanceof Error ? err.message : "An unknown error occurred.", {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "https://lyp.ink", "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
