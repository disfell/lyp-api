export const dynamic = "force-static";

export async function GET() {
  // const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.STEAM_TOKEN}&steamids=${process.env.STEAM_ID}`;
  const res = await fetch("https://data.mongodb-api.com/...", {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();

  return Response.json({ data });
}
