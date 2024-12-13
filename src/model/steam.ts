interface GameDictCN {
  [key: number]: string;
}

export interface GameListResponse {
  response: {
    total_count: number;
    games: {
      appid?: number;
      name?: string;
      playtime_2weeks?: number;
      playtime_forever?: number;
      img_icon_url?: string;
      playtime_windows_forever?: number;
      playtime_mac_forever?: number;
      playtime_linux_forever?: number;
      playtime_deck_forever?: number;
    }[]
  };
}

export interface StatusOutput {
  status?: number;
  game?: string;
  game_id?: number;
  game_cn?: string;
}

export interface StatusResponse {
  response: {
    players: {
      personastate: number;
      gameextrainfo: string;
      gameid: number;
    }[];
  };
}

export const steamDict: GameDictCN = {
  3590: "植物大战僵尸",
  105600: "星露谷",
  292030: "巫师3：狂猎",
  367520: "空洞骑士",
  424840: "小小梦魇1",
  435150: "神界原罪2",
  582010: "怪物猎人·世界",
  588650: "死亡细胞",
  601150: "鬼泣5",
  814380: "只狼·影逝二度",
  860510: "小小梦魇2",
  1057090: "精灵与萤火意志",
  1238840: "战地风云1",
  1245620: "艾尔登法环",
  1296830: "暖雪",
  1371980: "恶意不息",
  1449690: "行尸走肉",
  1517290: "战地风云5",
  2138710: "师傅",
  2358720: "黑神话·悟空",
  2379780: "小丑牌",
  1086940: "博得之门3",
  275850: "无人深空",
  571310: "蒸汽世界：挖掘2",
  1130410: "赛博之钩",
};