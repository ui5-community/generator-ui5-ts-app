import AppControl from "sap/m/App";
import View from "sap/ui/core/mvc/View";

export default class App extends View {
	public getControllerName(): string {
		return "<%= appId %>.controller.App";
	}

	public getAutoPrefixId(): boolean {
		return true;
	}

	public createContent(): AppControl {
		return <AppControl id="app" /> as AppControl;
	}
}
