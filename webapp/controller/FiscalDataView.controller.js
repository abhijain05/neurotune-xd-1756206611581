sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, JSONModel, MessageToast, Export, ExportTypeCSV, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("converted.fiscaldataview.controller.FiscalDataView", {
		onInit: function() {
			// Load mock data
			var oFiscalDataModel = new JSONModel();
			oFiscalDataModel.loadData("model/mockData/fiscalData.json");
			this.getView().setModel(oFiscalDataModel, "fiscalData");
		},

		onOnActionGo: function() {
			//Simulate fetching data based on filter criteria
			MessageToast.show("Fetching data...");
		},

		onOnActionHideFilterBar: function() {
			//Toggle visibility of the filter bar
			var oFilterBar = this.getView().byId("filterFormContainer");
			oFilterBar.setVisible(!oFilterBar.getVisible());
			var oLink = this.getView().byId("hideFilterBarLink");
			oLink.setText(oFilterBar.getVisible() ? "Hide Filter Bar" : "Show Filter Bar");
		},
		onOnActionFilters: function() {
			MessageToast.show("Filters functionality not yet implemented"); // Placeholder
		},

		onExportToCSV: function() {
			// Export table data to CSV
			var oTable = this.byId("fiscalDataTable");
			var aData = oTable.getModel("fiscalData").getData().fiscalInformation;
			var sCsvContent = this._convertToCSV(aData);
			var oBlob = new Blob([sCsvContent], { type: "text/csv" });
			var sUrl = URL.createObjectURL(oBlob);
			var oLink = document.createElement("a");
			oLink.href = sUrl;
			oLink.download = "fiscal_data_export.csv";
			oLink.click();
			URL.revokeObjectURL(sUrl);
			MessageToast.show("Exported to CSV!");
		},
		_convertToCSV: function(aData) {
			if (!aData || aData.length === 0) return "";
			var aHeaders = Object.keys(aData[0]);
			var sCsv = aHeaders.join(",") + "\n";
			aData.forEach(function(row) {
				var aValues = aHeaders.map(function(header) {
					return '"' + (row[header] || "").toString().replace(/"/g, '""') + '"';
				});
				sCsv += aValues.join(",") + "\n";
			});
			return sCsv;
		},
		onExportToExcel: function() {
			// Export table data to Excel (requires sap.ui.core.util.Export)
			var oTable = this.byId("fiscalDataTable");
			var oExport = new Export({
				exportType: new ExportTypeCSV({
					fileExtension: "xlsx",
					mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				}),
				models: oTable.getModel("fiscalData"),
				rows: {
					path: "/fiscalInformation"
				},
				columns: this._getExportColumns()
			});
			oExport.saveFile().then(function() {
				MessageToast.show("Export to Excel complete!");
			});
		},
		_getExportColumns: function() {
			var oTable = this.byId("fiscalDataTable");
			return oTable.getColumns().map(function(oColumn) {
				return {
					name: oColumn.getHeader().getText(),
					template: { content: { path: oColumn.getAggregation("template")[0].getText() } }
				};
			});
		}
	});
});
