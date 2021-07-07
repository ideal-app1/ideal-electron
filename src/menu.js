import {
  app,
  Menu,
  shell
} from 'electron';

export default class MenuBuilder {

  constructor(mainWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  sendCmd(arg) {
    this.mainWindow.webContents.send('handle-shortcut', arg)
  }

  buildDarwinTemplate() {
    const subMenuAbout = {
      label: 'Ideal',
      submenu: [
        {
          label: 'About Ideal',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide Ideal',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', click: () => { this.sendCmd('undo') } },
        { label: 'Redo', accelerator: 'Shift+Command+Z', click: () => { this.sendCmd('redo') } },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', click: () => { this.sendCmd('cut') } },
        { label: 'Copy', accelerator: 'Command+C', click: () => { this.sendCmd('copy') } },
        { label: 'Paste', accelerator: 'Command+V', click: () => { this.sendCmd('paste') } },
        //{ label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:', },
      ],
    };
    const subMenuViewDev = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp = {
      label: 'Help',
      submenu: [
        {
          label: 'Get help on our Discord',
          click() {
            shell.openExternal('https://discord.gg/4T9DGFvA');
          },
        },
        {
          label: 'Submit Feedback...',
          click() {
            shell.openExternal('https://forms.gle/sQU17XHw3LiHXLdS6');
          },
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal('https://docs.idealapp.fr');
          },
        }
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O',
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close();
            },
          },
        ],
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.mainWindow.webContents.reload();
                  },
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.mainWindow.webContents.toggleDevTools();
                  },
                },
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.mainWindow.setFullScreen(
                      !this.mainWindow.isFullScreen()
                    );
                  },
                },
              ],
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Get help on our Discord',
            click() {
              shell.openExternal('https://discord.gg/4T9DGFvA');
            },
          },
          {
            label: 'Submit Feedback...',
            click() {
              shell.openExternal('https://forms.gle/sQU17XHw3LiHXLdS6');
            },
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal('https://docs.idealapp.fr');
            },
          }
        ],
      },
    ];

    return templateDefault;
  }
}
