import { MainScene } from "./MainScene";
declare function require(x: string): any;

//メインのゲーム画面
export class MainGame extends g.E {
	public reset: () => void;
	public setMode: (num: number) => void;

	constructor(scene: MainScene) {
		const tl = require("@akashic-extension/akashic-timeline");
		const timeline = new tl.Timeline(scene);
		const sizeW = 500;
		const sizeH = 360;
		super({ scene: scene, x: 0, y: 0, width: sizeW, height: sizeH, touchable: true });

		const waku = new g.Sprite({
			scene: scene,
			x: 50, y: 0,
			src: scene.assets["waku"]
		});
		this.append(waku);

		const wakuf = new g.Sprite({
			scene: scene,
			x: 50, y: 0,
			src: scene.assets["wakuf"]
		});
		this.append(wakuf);

		const base = new g.E({
			scene: scene,
			x: 55, y: 5
		});
		this.append(base);

		const font = new g.DynamicFont({
			game: g.game,
			fontFamily: g.FontFamily.Serif,
			size: 32
		});

		const panels: g.FrameSprite[] = [];
		const panelSize = 70;
		const panelNum = 5;
		let nextNum = 0;
		for (let y = 0; y < panelNum; y++) {
			for (let x = 0; x < panelNum; x++) {
				const panel = new g.FrameSprite({
					scene: scene,
					src: scene.assets["panel"] as g.ImageAsset,
					x: x * panelSize,
					y: y * panelSize,
					width: panelSize,
					height: panelSize,
					frames: [0, 1, 2, 3],
					touchable: true
				});
				base.append(panel);
				panels.push(panel);

				const num = y * panelNum + x;

				//ラベル
				const list: number[] = [];
				for (let i = 0; i < panelNum * panelNum; i++) {
					list.push(i);
				}
				const label = new g.FrameSprite({
					scene: scene,
					src: scene.assets["number"] as g.ImageAsset,
					width: 60,
					height: 60,
					x: 5,
					y: 5,
					frames: list
				});
				panel.append(label);
				panel.tag = num;

				panel.pointDown.add(() => {
					if (nextNum === panel.tag && scene.isStart) {
						panel.frameNumber = 3;
						panel.modified();
						nextNum++;
						scene.addScore(100 + ((stageNum - 1) * 50));
						if (nextNum === panelNum * panelNum) {
							wakuf.show();
							timeline.create().wait(500).call(() => {
								next();
							});
							scene.playSound("se_clear");
						}
						scene.playSound("se_move");
					} else {
						scene.playSound("se_miss");
					}
				});
			}
		}

		let isStop = false;
		let stageNum = 0;
		this.pointDown.add((e) => {
			if (!scene.isStart || isStop) return;
		});

		this.pointMove.add((e) => {
			if (!scene.isStart || isStop) return;
		});

		this.pointUp.add((e) => {
			if (!scene.isStart || isStop) return;
		});

		const next = () => {
			stageNum++;
			const list: number[] = [];
			for (let i = 0; i < panelNum * panelNum; i++) {
				list.push(i);
			}

			//シャッフル
			for (let i = list.length - 1; i > 0; i--) {
				const r = scene.random.get(0, i );
				const tmp = list[i];
				list[i] = list[r];
				list[r] = tmp;
			}

			//パネルに数字を入れる
			const num = scene.random.get(0, 2);
			for (let i = 0; i < panels.length; i++) {
				panels[i].tag = list[i];
				panels[i].frameNumber = num;
				panels[i].modified();
				const label = panels[i].children[0] as g.FrameSprite;
				label.frameNumber = list[i];
				label.modified();
			}

			wakuf.hide();

			nextNum = 0;
			scene.setStage(stageNum);
		};

		//リセット
		this.reset = () => {
			nextNum = 0;
			stageNum = 0;
			next();
		};

	}
}
