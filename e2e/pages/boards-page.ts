import { type Page } from '@playwright/test';
import crypto from 'crypto'

export class BoardsPage {
    constructor(public readonly page: Page) {
    }

    async openBoardsDrawer() {
        await this.page.locator('label:has-text("Boards")').click()
    }

    async closeBoardsDrawer() {
        await this.page.click('.drawer-side')
    }

    async useNewBoard() {
        const name = this.randomName()

        await this.openBoardsDrawer()
        await this.createBoard(name)
        await this.selectBoard(name)
        await this.closeBoardsDrawer()

        return name
    }

    async selectBoard(name: string) {
        await this.page.locator(this.listSelectorString(name)).click()
    }

    async createBoard(name: string) {
        await this.page.locator('div[data-tip="Create new board"]').click()
        await this.page.locator('#create_board_modal input[placeholder="New board name"]').fill(name)
        await this.page.locator('button:has-text("Create Board")').click()
    }

    async updateBoardName(originalName: string, newName: string) {
        await this.page.hover(this.listSelectorString(originalName))
        await this.page.locator(`${this.listSelectorString(originalName)} div[data-tip="Rename"]`).click()
        await this.page.locator('#rename_board_modal input[placeholder="New board name"]').fill(newName)
        await this.page.locator('button:has-text("Rename Board")').click()
    }

    async deleteBoard(name: string) {
        this.page.on('dialog', dialog => dialog.accept());
        await this.page.hover(this.listSelectorString(name))
        await this.page.locator(`${this.listSelectorString(name)} div[data-tip="Delete"]`).click()
    }

    async gotoScreenshotView() {
        const match = this.page.url().match(/\/boards\/(.*)/);
        if (!match) {
            throw new Error('Board ID not found')
        }
        await this.page.goto(`/#/boards/${match[1]}/screenshot`)
    }

    listSelector(name: string) {
        return this.page.locator(this.listSelectorString(name))
    }

    listSelectorString(name: string) {
        return `.drawer-side ul li:has-text("${name}")`
    }

    randomName() {
        return `My new board ${crypto.randomBytes(5).toString('hex')}`
    }
}