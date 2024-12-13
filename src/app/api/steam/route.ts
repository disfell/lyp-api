import { isBlank } from "@/app/utils/str";
import { StatusOutput, steamDict, StatusResponse } from "@/app/model/steam";

/**
 * 用来获取展示 steam 用户正在玩什么、在线状态这些信息
 */
export async function GET() {
  const id = process.env.STEAM_ID || "";
  const token = process.env.STEAM_TOKEN || "";

  if (isBlank(id, token)) {
    return new Response("缺少配置，请查看 steamToken、steamId 是否完整", {
      status: 400,
    });
  }

  try {
    const output: StatusOutput = {};
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
    return Response.json(output);
  } catch (err: unknown) {
    console.error(err);
    return new Response(err instanceof Error ? err.message : "An unknown error occurred.", {
      status: 500,
    });
  }
}
