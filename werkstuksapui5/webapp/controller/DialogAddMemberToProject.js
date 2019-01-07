sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast"
], function(ManagedObject, MessageBox, Utilities, History,MessageToast) {

	return ManagedObject.extend("com.sap.build.standard.mobileEnterpriseProject.controller.DialogAddMemberToProject", {
		constructor: function(oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.mobileEnterpriseProject.view.DialogAddMemberToProject", this);
			this._bInit = false;
		},

		exit: function() {
			delete this._oView;
		},

		getView: function() {
			return this._oView;
		},

		getControl: function() {
			return this._oControl;
		},

		getOwnerComponent: function() {
			return this._oView.getController().getOwnerComponent();
		},
			_oDataCall: function() {
				
			var Naam = this.getView().byId("Naam").mProperties.value;
            var Functie =this.getView().byId("Functie").mProperties.value;
			var view = this.getView();
               
                
            this.getView().getModel().read("/MembersInfoSet",{
            	success: function(resp)
            	{
            		var last = resp.results.length - 1;
            		var id = resp.results[last].Memberid;
            		id = parseInt(id);
            		id++;
            		
            		 var properties = {
                	"Memberid": id +"",

                    "Naam" : Naam,
                    "Functie" : Functie
                     };
            		
            		view.getModel().create("/MembersInfoSet",properties,
        			 {
        		     success : function(data)
        		     {
        		     	 
        		         MessageToast.show("SaveDone!");
        		         
        		     },

        		     error : function(data)
        		     {
        		         MessageToast.show("Error");
        		                    
        		     }
        				});
        			
        		 		
        		 	}
        		 	
            	
            });

          
			this.close();
		},

		open: function() {
			var oView = this._oView;
			var oControl = this._oControl;

			if (!this._bInit) {

				// Initialize our fragment
				this.onInit();

				this._bInit = true;

				// connect fragment to the root view of this component (models, lifecycle)
				oView.addDependent(oControl);
			}

			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},
			_onButtonPress: function() {

			this.close();

		},

		close: function() {
			this._oControl.close();
		},

		setRouter: function(oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function() {
			return {};

		},
	
	
		onInit: function() {

			this._oDialog = this.getControl();

		},
		onExit: function() {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);
