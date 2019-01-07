sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./DialogAddMemberToProject", "./DialogDeleteMemberProject",
	"./utilities",
	"sap/ui/core/routing/History","sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function(BaseController, MessageBox, DialogAddMemberToProject, DialogDeleteMemberProject, Utilities, History,JSONModel,MessageToast) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.mobileEnterpriseProject.controller.EditProject", {
		handleRouteMatched: function(oEvent) {
			var sAppId = "App5bf28417669f870111c4b47c";

			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;

			} else {
				if (this.getOwnerComponent().getComponentData()) {
					var patternConvert = function(oParam) {
						if (Object.keys(oParam).length !== 0) {
							for (var prop in oParam) {
								if (prop !== "sourcePrototype") {
									return prop + "(" + oParam[prop][0] + ")";
								}
							}
						}
					};

					this.sContext = patternConvert(this.getOwnerComponent().getComponentData().startupParameters);

				}
			}

			var oPath;

			if (this.sContext) {
				oPath = {
					path: "/" + this.sContext,
					parameters: oParams
				};
				this.getView().bindObject(oPath);
			}

		},
		_editProject: function(){
			
			var bedrijfid = this.getView().byId("bedrijfid").mProperties.value;
            var projectnaam =this.getView().byId("projectnaam").mProperties.value;
			var view = this.getView();
			var desc = this.getView().byId("description").mProperties.value;
			var projm = this.getView().byId("projman").mProperties.value;
			var status =this.getView().byId("status").mProperties.value;
			var date1 =this.getView().byId("start").mProperties.value;
			var date2 =this.getView().byId("end").mProperties.value;
                
            this.getView().getModel().read("/ProjectInfoSet",{
            	success: function(resp)
            	{
            		var last = resp.results.length - 1;
            		var id = resp.results[last].Projectid;
            		id = parseInt(id);
            		
            		
            		 var properties = {
                	"Projectid": id +"",
                	"Bedrijfid" : bedrijfid,
                	"Projectnaam":projectnaam,
                	"Description":desc,
                	"Projectmanager":projm,
                	"Status":status,
                	"Begindatum":date1,
                	"Einddatum":date2
               
                     };
            		
            		view.getModel().update("/ProjectInfoSet",properties,
        			 {
        		     success : function(data)
        		     {
        		     	this.close();
        		         MessageToast.show("SaveDone!");
        		        
        		         
        		     },

        		     error : function(data)
        		     {
        		         MessageToast.show("Error");
        		     }
        				});
        		 		
        		 	}
            	
            });
		
			
		},
		_onButtonPress: function(oEvent) {

			var oBindingContext = oEvent.getSource().getBindingContext();

			return new Promise(function(fnResolve) {

				this.doNavigate("Page1", oBindingContext, fnResolve, "");
			}.bind(this)).catch(function(err) {
				if (err !== undefined) {
					MessageBox.error(err.message);
				}
			});

		},
		doNavigate: function(sRouteName, oBindingContext, fnPromiseResolve, sViaRelation) {
			var sPath = (oBindingContext) ? oBindingContext.getPath() : null;
			var oModel = (oBindingContext) ? oBindingContext.getModel() : null;

			var sEntityNameSet;
			if (sPath !== null && sPath !== "") {
				if (sPath.substring(0, 1) === "/") {
					sPath = sPath.substring(1);
				}
				sEntityNameSet = sPath.split("(")[0];
			}
			var sNavigationPropertyName;
			var sMasterContext = this.sMasterContext ? this.sMasterContext : sPath;

			if (sEntityNameSet !== null) {
				sNavigationPropertyName = sViaRelation || this.getOwnerComponent().getNavigationPropertyForNavigationWithContext(sEntityNameSet, sRouteName);
			}
			if (sNavigationPropertyName !== null && sNavigationPropertyName !== undefined) {
				if (sNavigationPropertyName === "") {
					this.oRouter.navTo(sRouteName, {
						context: sPath,
						masterContext: sMasterContext
					}, false);
				} else {
					oModel.createBindingContext(sNavigationPropertyName, oBindingContext, null, function(bindingContext) {
						if (bindingContext) {
							sPath = bindingContext.getPath();
							if (sPath.substring(0, 1) === "/") {
								sPath = sPath.substring(1);
							}
						} else {
							sPath = "undefined";
						}

						// If the navigation is a 1-n, sPath would be "undefined" as this is not supported in Build
						if (sPath === "undefined") {
							this.oRouter.navTo(sRouteName);
						} else {
							this.oRouter.navTo(sRouteName, {
								context: sPath,
								masterContext: sMasterContext
							}, false);
						}
					}.bind(this));
				}
			} else {
				this.oRouter.navTo(sRouteName);
			}

			if (typeof fnPromiseResolve === "function") {
				fnPromiseResolve();
			}

		},
		_onButtonPress1: function() {

			var sDialogName = "DialogAddMemberToProject";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new DialogAddMemberToProject(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
		_onButtonPress2: function() {

			var sDialogName = "DialogDeleteMemberProject";
			this.mDialogs = this.mDialogs || {};
			var oDialog = this.mDialogs[sDialogName];

			if (!oDialog) {
				oDialog = new DialogDeleteMemberProject(this.getView());
				this.mDialogs[sDialogName] = oDialog;

				// For navigation.
				oDialog.setRouter(this.oRouter);
			}
			oDialog.open();

		},
		/*onInit: function() {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("editProject").attachPatternMatched(this._onObjectMatched, this);
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0
			});

			oRouter.getRoute("editProject").attachPatternMatched(this._onObjectMatched, this);

			//setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
			
		},	*/_onObjectMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			//	this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("ProjectInfoSet", {
					Projectid: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

		},	_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.oRouter.getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				//	this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath();
			/*	oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.Id,
				sObjectName = oObject.Naam,
				oViewModel = this.getModel("detailView");*/

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

		},	_onMetadataLoaded: function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		},
		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
	});
}, /* bExport= */ true);
