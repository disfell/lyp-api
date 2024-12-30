import { isBlank } from "@/utils/str";
import { StatusOutput, StatusResponse, steamDict } from "@/model/steam";
import { root } from "@/model/response";

// https://docs.netlify.com/frameworks/next-js/runtime-v4/advanced-api-routes/
export const config = {
  type: "experimental-background",
};

/**
 * 用来获取展示 steam 用户正在玩什么、在线状态这些信息
 */
export async function GET() {
  const id = process.env.STEAM_ID || "";
  const token = process.env.STEAM_TOKEN || "";

  if (isBlank(id, token)) {
    return new Response("缺少配置，请查看 steamToken、steamId 是否完整", {
      status: 400,
      headers: { ...root },
    });
  }

  try {
    const output: StatusOutput = { _time: new Date() };
    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${token}&steamids=${id}`;
    const res = await fetch(url);
    const data: StatusResponse = await res.json();
    const players = data.response.players[0];
    output.status = players.personastate;
    output.game = players.gameextrainfo;
    output.game_id = players.gameid;
    output.game_cn = players.gameextrainfo;
    if (players.gameid in steamDict) {
      output.game_cn = steamDict[players.gameid];
    }
    return new Response(JSON.stringify(output), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", ...root },
    });
  } catch (err: unknown) {
    return new Response(err instanceof Error ? err.message : "An unknown error occurred.", {
      status: 500,
      headers: { ...root },
    });
  }
}
