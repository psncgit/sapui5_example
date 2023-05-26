sap.ui.define(
	[
		"sap/ui/core/UIComponent", //
		"sap/ui/model/json/JSONModel",
	],
	function (UIComponent, JSONModel) {
		"use strict";
		return UIComponent.extend("sap.ui.demo.walkthrough.Component", {
			metadata: {
				interfaces: ["sap.ui.core.IAsyncContentCreation"],
				manifest: "json",
			},
			init: function () {
				// call the init function of the parent
				UIComponent.prototype.init.apply(this, arguments);

				// set data model
				var oData = {
					// 경조 기본정보
					form: {
						Concode: "", // 유형
						Conresn: "", // 사유
						Kdsvh: "", // 관계
						Zeloc: "", // 장소
						Zbirthday: null, // 생년월일
						Conddate: null, // 경조일
					},
					// 관계 목록
					list: [
						{ Idx: 1, Relation: "10", Ename: "김수현", Birth: new Date("1985-03-15") }, //
						{ Idx: 2, Relation: "14", Ename: "박서준", Birth: new Date("2008-02-10") },
						{ Idx: 3, Relation: "16", Ename: "박은빈", Birth: new Date("2010-11-02") },
					],
					listInfo: {
						rowCount: 3,
						totalCount: 3,
						selectionMode: "MultiToggle",
					},
					detail: {}, // 보기 팝업
					entry: {
						// 유형 엔트리
						Concode: [
							{ Zcode: "1000", Ztext: "결혼" },
							{ Zcode: "2000", Ztext: "회갑" },
							{ Zcode: "4000", Ztext: "사망" },
							{ Zcode: "5000", Ztext: "상해입원" },
						],
						// 사유 엔트리
						Conresn: [],
						// 관계 엔트리
						Kdsvh: [],
					},
					ConresnList: [
						{ Concode: "1000", Zcode: "1010", Ztext: "본인결혼" },
						{ Concode: "1000", Zcode: "1020", Ztext: "자녀 결혼" },
						{ Concode: "1000", Zcode: "1030", Ztext: "형제자매 결혼" },
						{ Concode: "1000", Zcode: "1040", Ztext: "배우자의 형제자매 결혼" },
						{ Concode: "2000", Zcode: "2010", Ztext: "본인 회갑" },
						{ Concode: "2000", Zcode: "2020", Ztext: "배우자 회갑" },
						{ Concode: "2000", Zcode: "2030", Ztext: "부모 회갑" },
						{ Concode: "2000", Zcode: "2040", Ztext: "배우자의 부모 회갑" },
						{ Concode: "2000", Zcode: "2050", Ztext: "조부모 회갑" },
						{ Concode: "4000", Zcode: "4020", Ztext: "부모 사망" },
						{ Concode: "4000", Zcode: "4030", Ztext: "배우자 사망" },
						{ Concode: "4000", Zcode: "4040", Ztext: "자녀 사망" },
						{ Concode: "4000", Zcode: "4050", Ztext: "배우자의 부모 사망" },
						{ Concode: "4000", Zcode: "4060", Ztext: "형제자매 사망" },
						{ Concode: "4000", Zcode: "4070", Ztext: "조부모,외조부모 사망" },
						{ Concode: "4000", Zcode: "4080", Ztext: "배우자의 형제자매 사망" },
						{ Concode: "4000", Zcode: "4090", Ztext: "백부/백모/숙부/숙모 사망" },
						{ Concode: "5000", Zcode: "5010", Ztext: "2주이상~4주미만" },
						{ Concode: "5000", Zcode: "5020", Ztext: "4주이상~6주미만" },
						{ Concode: "5000", Zcode: "5030", Ztext: "6주이상~8주미만" },
						{ Concode: "5000", Zcode: "5040", Ztext: "8주이상" },
					],
					KdsvhList: [
						{ Conresn: ["1010", "2010", "5010", "5020", "5030", "5040"], Zcode: "ME", Ztext: "본인" },
						{ Conresn: ["1020", "4040"], Zcode: "14", Ztext: "아들" },
						{ Conresn: ["1020", "4040"], Zcode: "16", Ztext: "딸" },
						{ Conresn: ["1030", "4060"], Zcode: "30", Ztext: "형(오빠)" },
						{ Conresn: ["1030", "4060"], Zcode: "32", Ztext: "제(남동생)" },
						{ Conresn: ["1030", "4060"], Zcode: "34", Ztext: "자(누나,언니)" },
						{ Conresn: ["1030", "4060"], Zcode: "36", Ztext: "매(여동생)" },
						{ Conresn: ["1040", "4060", "4080"], Zcode: "48", Ztext: "배우자의 형제" },
						{ Conresn: ["1040", "4060", "4080"], Zcode: "50", Ztext: "배우자의 자매" },
						{ Conresn: ["2020", "4030"], Zcode: "10", Ztext: "처" },
						{ Conresn: ["2020", "4030"], Zcode: "12", Ztext: "남편" },
						{ Conresn: ["2030", "4020"], Zcode: "22", Ztext: "부" },
						{ Conresn: ["2030", "4020"], Zcode: "24", Ztext: "모" },
						{ Conresn: ["2040", "4050"], Zcode: "26", Ztext: "배우자의 부" },
						{ Conresn: ["2040", "4050"], Zcode: "28", Ztext: "배우자의 모" },
						{ Conresn: ["2050", "4070"], Zcode: "52", Ztext: "조부" },
						{ Conresn: ["2050", "4070"], Zcode: "54", Ztext: "조모" },
						{ Conresn: ["4070"], Zcode: "60", Ztext: "외조부" },
						{ Conresn: ["4070"], Zcode: "62", Ztext: "외조모" },
						{ Conresn: ["4090"], Zcode: "76", Ztext: "백부" },
						{ Conresn: ["4090"], Zcode: "78", Ztext: "백모" },
						{ Conresn: ["4090"], Zcode: "80", Ztext: "숙부" },
						{ Conresn: ["4090"], Zcode: "82", Ztext: "숙모" },
					],
				};
				var oModel = new JSONModel(oData);
				this.setModel(oModel);
			},
		});
	}
);
