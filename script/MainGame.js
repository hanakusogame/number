"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
//メインのゲーム画面
var MainGame = /** @class */ (function (_super) {
    __extends(MainGame, _super);
    function MainGame(scene) {
        var _this = this;
        var tl = require("@akashic-extension/akashic-timeline");
        var timeline = new tl.Timeline(scene);
        var sizeW = 500;
        var sizeH = 360;
        _this = _super.call(this, { scene: scene, x: 0, y: 0, width: sizeW, height: sizeH, touchable: true }) || this;
        var waku = new g.Sprite({
            scene: scene,
            x: 50, y: 0,
            src: scene.assets["waku"]
        });
        _this.append(waku);
        var wakuf = new g.Sprite({
            scene: scene,
            x: 50, y: 0,
            src: scene.assets["wakuf"]
        });
        _this.append(wakuf);
        var base = new g.E({
            scene: scene,
            x: 55, y: 5
        });
        _this.append(base);
        var font = new g.DynamicFont({
            game: g.game,
            fontFamily: g.FontFamily.Serif,
            size: 32
        });
        var panels = [];
        var panelSize = 70;
        var panelNum = 5;
        var nextNum = 0;
        for (var y = 0; y < panelNum; y++) {
            var _loop_1 = function (x) {
                var panel = new g.FrameSprite({
                    scene: scene,
                    src: scene.assets["panel"],
                    x: x * panelSize,
                    y: y * panelSize,
                    width: panelSize,
                    height: panelSize,
                    frames: [0, 1, 2, 3],
                    touchable: true
                });
                base.append(panel);
                panels.push(panel);
                var num = y * panelNum + x;
                //ラベル
                var list = [];
                for (var i = 0; i < panelNum * panelNum; i++) {
                    list.push(i);
                }
                var label = new g.FrameSprite({
                    scene: scene,
                    src: scene.assets["number"],
                    width: 60,
                    height: 60,
                    x: 5,
                    y: 5,
                    frames: list
                });
                panel.append(label);
                panel.tag = num;
                panel.pointDown.add(function () {
                    if (nextNum === panel.tag && scene.isStart) {
                        panel.frameNumber = 3;
                        panel.modified();
                        nextNum++;
                        scene.addScore(100 + ((stageNum - 1) * 50));
                        if (nextNum === panelNum * panelNum) {
                            wakuf.show();
                            timeline.create().wait(500).call(function () {
                                next();
                            });
                            scene.playSound("se_clear");
                        }
                        scene.playSound("se_move");
                    }
                    else {
                        scene.playSound("se_miss");
                    }
                });
            };
            for (var x = 0; x < panelNum; x++) {
                _loop_1(x);
            }
        }
        var isStop = false;
        var stageNum = 0;
        _this.pointDown.add(function (e) {
            if (!scene.isStart || isStop)
                return;
        });
        _this.pointMove.add(function (e) {
            if (!scene.isStart || isStop)
                return;
        });
        _this.pointUp.add(function (e) {
            if (!scene.isStart || isStop)
                return;
        });
        var next = function () {
            stageNum++;
            var list = [];
            for (var i = 0; i < panelNum * panelNum; i++) {
                list.push(i);
            }
            //シャッフル
            for (var i = list.length - 1; i > 0; i--) {
                var r = scene.random.get(0, i);
                var tmp = list[i];
                list[i] = list[r];
                list[r] = tmp;
            }
            //パネルに数字を入れる
            var num = scene.random.get(0, 2);
            for (var i = 0; i < panels.length; i++) {
                panels[i].tag = list[i];
                panels[i].frameNumber = num;
                panels[i].modified();
                var label = panels[i].children[0];
                label.frameNumber = list[i];
                label.modified();
            }
            wakuf.hide();
            nextNum = 0;
            scene.setStage(stageNum);
        };
        //リセット
        _this.reset = function () {
            nextNum = 0;
            stageNum = 0;
            next();
        };
        return _this;
    }
    return MainGame;
}(g.E));
exports.MainGame = MainGame;
