sap.ui.define(
	[
		"sap/ui/core/mvc/Controller", //
		"sap/m/MessageBox",
		"sap/ui/core/Fragment",
	],
	function (Controller, MessageBox, Fragment) {
		"use strict";
		return Controller.extend("sap.ui.demo.walkthrough.controller.App", {
			pDetailDialog: null,

			/**
			 * 언어 ComboBox 이벤트핸들러
			 *
			 * @param {sap.ui.base.Event} oEvent
			 */
			onChangeLanguage(oEvent) {
				const sSelectedKey = oEvent.getSource().getSelectedKey();

				sap.ui.getCore().getConfiguration().setLanguage(sSelectedKey);
			},

			/**
			 * 유형 ComboBox 이벤트핸들러
			 *	- 사유 ComboBox 엔트리를 변경
			 *
			 * @param {sap.ui.base.Event} oEvent
			 */
			onChangeConcode: function (oEvent) {
				const oViewModel = this.getView().getModel();
				const aConresnList = oViewModel.getProperty("/ConresnList"); // 사유 전체목록
				const sSelectedKey = oEvent.getSource().getSelectedKey(); // 1000
				const aSelectedCoresn = aConresnList.filter((el) => el.Concode === sSelectedKey);

				oViewModel.setProperty("/entry/Conresn", aSelectedCoresn);
				oViewModel.setProperty("/form/Conresn", "");
				oViewModel.setProperty("/form/Kdsvh", "");
			},

			/**
			 * 사유 ComboBox 이벤트핸들러
			 *	- 관계 ComboBox 엔트리를 변경
			 *
			 * @param {sap.ui.base.Event} oEvent
			 */
			onChangeConresn: function (oEvent) {
				const oViewModel = this.getView().getModel();
				const aKdsvhList = oViewModel.getProperty("/KdsvhList");
				const sSelectedKey = oEvent.getSource().getSelectedKey();
				const aSelectedKdsvh = aKdsvhList.filter((el) => el.Conresn.includes(sSelectedKey));

				oViewModel.setProperty("/entry/Kdsvh", aSelectedKdsvh);
				oViewModel.setProperty("/form/Kdsvh", "");
			},

			/**
			 * (Async) 목록-보기 Button 이벤트핸들러
			 *	- 상세내역 팝업을 호출
			 *
			 * @param {sap.ui.base.Event} oEvent
			 */
			onPressDetail: async function (oEvent) {
				const oViewModel = this.getView().getModel();
				const mSelectedRowData = oEvent.getSource().getParent().getParent().getBindingContext().getObject();

				oViewModel.setProperty("/detail", { ...mSelectedRowData });

				if (!this.pDetailDialog) {
					const oView = this.getView();
					this.pDetailDialog = await Fragment.load({
						id: oView.getId(),
						name: "sap.ui.demo.walkthrough.view.fragment.DetailDialog",
						controller: this,
					});
					oView.addDependent(this.pDetailDialog);
				}

				this.pDetailDialog.open();
			},

			/**
			 * 상세내역 팝업을-닫기 Button 이벤트핸들러
			 *
			 */
			onPressCloseDialog: function () {
				this.pDetailDialog.close();
			},

			/**
			 * 목록-추가 Button 이벤트핸들러
			 *
			 */
			onPressAdd: function () {
				const oViewModel = this.getView().getModel();
				const aList = oViewModel.getProperty("/list");
				const iNestIdx = aList[aList.length - 1]?.Idx + 1 || 1;

				oViewModel.setProperty("/list", [...aList, { Idx: iNestIdx }]);
				oViewModel.setProperty("/listInfo/totalCount", aList.length + 1);
				oViewModel.setProperty("/listInfo/rowCount", Math.min(aList.length + 1, 10));
			},

			/**
			 * 목록-삭제 Button 이벤트핸들러
			 *
			 */
			onPressLess: function () {
				const oViewModel = this.getView().getModel();
				const oBundle = this.getView().getModel("i18n").getResourceBundle();
				const oTable = this.byId("relationTable");
				const aSelectedIndices = oTable.getSelectedIndices(); // 선택한 table row index 배열

				if (aSelectedIndices.length < 1) {
					MessageBox.alert(oBundle.getText("messageRequireDeleteTarget")); // 삭제할 대상을 선택하여 주십시오.
					return;
				}

				const sConfirmMessage = oBundle.getText("messageDeleteConfirm");
				MessageBox.confirm(sConfirmMessage, {
					actions: [oBundle.getText("delete"), MessageBox.Action.CANCEL],
					onClose: function (sAction) {
						if (sAction === MessageBox.Action.CANCEL) return;

						const aTableData = oViewModel.getProperty("/list");
						const oTableRows = oTable.getBinding("rows");
						const aSelectedRows = oTableRows
							.getContexts(0, oTableRows.getLength())
							.filter((el, idx) => aSelectedIndices.includes(idx))
							.map((el) => el.getObject());
						const aUnSelectedData = aTableData.filter((el) => {
							return !aSelectedRows.some((d) => el.Idx === d.Idx);
						});

						oViewModel.setProperty("/listInfo/totalCount", aUnSelectedData.length);
						oViewModel.setProperty("/listInfo/rowCount", Math.min(aUnSelectedData.length, 10));
						oViewModel.setProperty(
							"/list",
							aUnSelectedData.map((el, idx) => ({ ...el, Idx: idx + 1 }))
						);
					},
				});
			},
		});
	}
);
