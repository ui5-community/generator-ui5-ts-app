import BaseController from "<%= appURI %>/controller/BaseController";
import AppComponent from "../Component";

/**
 * @namespace <%= appId %>.controller
 */
export default class App extends BaseController {

	public onInit() : void {
		// apply content density mode to root view
		this.getView().addStyleClass((this.getOwnerComponent() as AppComponent).getContentDensityClass());
	}

}
