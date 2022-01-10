import MessageBox from "sap/m/MessageBox";
import Controller from "sap/ui/core/mvc/Controller";
import AppComponent from "../Component";

/**
 * @namespace <%= appId %>.controller
 */
export default class MainController extends Controller {

	public sayHello() : void {
		MessageBox.show("Hello World!");
	}

}