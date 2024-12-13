import { isBlank } from "@/app/utils/str";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/app/model/database.types";
import dayjs from "dayjs";

export async function GET() {
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_KEY || "";

  if (isBlank(url, key)) {
    return new Response("缺少配置，请查看 supabaseUrl、supabaseKey 是否完整", {
      status: 400,
    });
  }

  const supabase = createClient<Database>(url, key);

  let list = [];

  try {
    const { data, error } = await supabase.from("lyp-steam-games").select("*");

    if (error) {
      console.error(error);
      return new Response(error.message, {
        status: 500,
      });
    }
    list = data;
  } catch (err) {
    console.error(err);
    return new Response(err instanceof Error ? err.message : "An unknown error occurred.", {
      status: 500,
    });
  }

  if (list != null && list.length > 0) {
    const pastDate = dayjs(list[0].updated_time);
    const over1day = dayjs().diff(pastDate, "day") >= 0.5;
    if (!over1day) {
      return Response.json({ data: list, from: "database" });
    }
  }

  const id = process.env.STEAM_ID || "";
  const token = process.env.STEAM_TOKEN || "";

  if (isBlank(id, token)) {
    return new Response("缺少配置，请查看 steamToken、steamId 是否完整", {
      status: 400,
    });
  }
  // const steamRecentlyURL = `http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1?key=${token}&steamid=${id}`;

  // 数据库-无数据，从steam获取
  try {
    // const result = await fetch(steamRecentlyURL);
    // const gameList: GameListResponse = await result.json();
    // 创建一个新数组，只包含所需的字段
  } catch (err) {
    console.error(err);
  }

  // return Response.json({ data: gameList, from: "steam" });
}
