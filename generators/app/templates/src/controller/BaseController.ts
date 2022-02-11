import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/History";
import UIComponent from "sap/ui/core/UIComponent";
import Model from "sap/ui/model/Model";
import ResourceBundle from "sap/ui/model/resource/ResourceModel";
import View from "sap/ui/core/mvc/View";
import Router from "sap/ui/core/routing/Router";

/**
 * @namespace <%= appId %>.controller
 */
export default class BaseController extends Controller {

	/**
	 * Convenience method for getting the view model by name in every controller of the application.
	 * @public
	 * @param {string} sName the model name
	 * @returns {sap.ui.model.Model} the model instance
	 */
	public getModel(sName?: string): Model {
		return this.getView().getModel(sName);
	}

	/**
	 * Convenience method for setting the view model in every controller of the application.
	 * @public
	 * @param {sap.ui.model.Model} oModel the model instance
	 * @param {string} sName the model name
	 * @returns {sap.ui.mvc.View} the view instance
	 */
	public setModel(oModel: Model, sName?: string): View {
		return this.getView().setModel(oModel, sName);
	}

	/**
	 * Convenience method for getting the resource bundle.
	 * @public
	 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
	 */
		public getResourceBundle() : ResourceBundle {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
	}

	/**
	 * Method for navigation to specific view
	 * @public
	 * @param {string} psTarget Parameter containing the string for the target navigation
	 * @param {mapping} pmParameters? Parameters for navigation
	 * @param {boolean} pbReplace? Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
	 */
	navTo(psTarget : string, pmParameters : object, pbReplace : boolean): void {
		this.getRouter().navTo(psTarget, pmParameters, pbReplace);
	}

	public getRouter() : Router {
		return UIComponent.getRouterFor(this);
	}

	onNavBack() : void {
		let sPreviousHash = History.getInstance().getPreviousHash();

		if (sPreviousHash !== undefined) {
			window.history.back();
		} else {
			this.getRouter().navTo("Main", {}, true /*no history*/);
		}
	}
}
