import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// 接口和类
interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	// 加载时运行
	async onload() {
		console.log("plugin loading");
		await this.loadSettings();

		// 这将在左侧功能区中创建一个图标。
		const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');


			// 检查浏览器是否支持 Notification API
			if ("Notification" in window) {
				// 请求通知权限
				Notification.requestPermission().then(permission => {
				if (permission === "granted") {
					// 创建一个通知
					const notification = new Notification("通知标题", {
					body: "这是通知的正文内容"
					});
				}
				});
			} else {
				console.log("浏览器不支持通知功能");
			}

		});

		// 使用功能区执行其他操作
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// 这会在应用程序的底部添加一个状态栏项目。不适用于移动应用程序。
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// 这添加了一个可以在任何地方触发的简单命令
		this.addCommand({
			id: 'open-sample-modal-simple',
			name: 'Open sample modal (simple)',
			callback: () => {
				// 检查浏览器是否支持 Notification API
				if ("Notification" in window) {
					// 请求通知权限
					Notification.requestPermission().then(permission => {
					if (permission === "granted") {
						// 创建一个通知
						const notification = new Notification("通知标题", {
						body: "这是通知的正文内容"
						});
					}
					});
				} else {
					console.log("浏览器不支持通知功能");
				}

				new SampleModal(this.app).open();
				
			}
		});

		// 这添加了一个编辑器命令，可以对当前编辑器实例执行一些操作
		this.addCommand({
			id: 'sample-editor-command',
			name: 'Sample editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());

				// 检查浏览器是否支持 Notification API
				if ("Notification" in window) {
					// 请求通知权限
					Notification.requestPermission().then(permission => {
					if (permission === "granted") {
						// 创建一个通知
						const notification = new Notification("通知标题", {
						body: "这是通知的正文内容"
						});
					}
					});
				} else {
					console.log("浏览器不支持通知功能");
				}

				editor.replaceSelection('Sample Editor Command');
			}
		});

		// 这添加了一个复杂的命令，可以检查应用程序的当前状态是否允许执行该命令
		this.addCommand({
			id: 'open-sample-modal-complex',
			name: 'Open sample modal (complex)',
			checkCallback: (checking: boolean) => {
				// 检查条件
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// 如果检查是真的，我们只是“检查”命令是否可以运行。
					// 如果checking为false，那么我们希望实际执行该操作。
					if (!checking) {
						new SampleModal(this.app).open();
					}

					// 只有当check函数返回true时，此命令才会显示在command Palette中
					return true;
				}
			}
		});

		// 这添加了一个设置选项卡，以便用户可以配置插件的各个方面
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// 如果插件挂接了任何全局DOM事件（在应用程序的不属于此插件的部分上）当此插件被禁用时，使用此函数将自动删除事件侦听器。
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// 注册间隔时，此函数将在插件被禁用时自动清除间隔。
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
		console.log("plugin unloading");
	}

	// 导入设置
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	// 保存设置
	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// 显示一个弹出页面
class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

// 插件设置
class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1') 		// 设置名称
			.setDesc('It\'s a secret')	// 设置描述
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
