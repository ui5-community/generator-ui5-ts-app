import MessageBox from "sap/m/MessageBox";
import BaseController from "<%= appURI %>/controller/BaseController";

/**
 * @namespace <%= appId %>.controller
 */
export default class Main extends Controller {

	public sayHello() : void {
		MessageBox.show("Hello World!");
	}

}
