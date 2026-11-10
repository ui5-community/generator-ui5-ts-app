import Button from "sap/m/Button";<% if (gte1_98_0) { %>
import IllustratedMessage from "sap/m/IllustratedMessage";
import Page from "sap/m/Page";<% } else { %>
import MessagePage from "sap/m/MessagePage";<% } %>
import View from "sap/ui/core/mvc/View";
import formatter from "../model/formatter";

export default class Main extends View {
	public getControllerName(): string {
		return "<%= appId %>.controller.Main";
	}

	public getAutoPrefixId(): boolean {
		return true;
	}

	public createContent(): <%= gte1_98_0 ? 'Page' : 'MessagePage' %> {
		const helloButton = (
			<Button
				id="helloButton"
				text={{ path: "i18n>btnText", formatter: formatter.formatValue }}
				press=".sayHello"
			/>
		) as Button;
<% if (gte1_98_0) { %>
		return (
			<Page title="{i18n>appTitle}" id="page">
				<IllustratedMessage
					title="{i18n>appTitle}"
					illustrationType="sapIllus-SuccessHighFive"<% if (gte1_104_0) { %>
					enableVerticalResponsiveness={true}<% } %>
					description="{i18n>appDescription}"
					additionalContent={[helloButton]}
				/>
			</Page>
		) as Page;
<% } else { %>
		return (
			<MessagePage
				title="{i18n>appTitle}"
				text="{i18n>appTitle}"
				icon="sap-icon://accept"
				id="page"
				description="{i18n>appDescription}"
				buttons={[helloButton]}
			/>
		) as MessagePage;
<% } %>
	}
}
