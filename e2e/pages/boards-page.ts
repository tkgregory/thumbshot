import { type Page, expect } from '@playwright/test';
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
        await this.closeBoardsDrawer()
        await expect(this.boardTitle(name)).toHaveCount(1)

        return name
    }

    async selectBoard(name: string) {
        await this.page.locator(this.listSelectorString(name)).scrollIntoViewIfNeeded()
        await this.page.locator(this.listSelectorString(name)).click()
    }

    async createBoardWithRandomName() {
        const name = this.randomName()
        await this.createBoard(name)
    }

    async createBoard(name: string) {
        await this.createBoardButton().click()
        await this.page.locator('#create_board_modal input[placeholder="New board name"]').fill(name)
        await this.page.locator('button:has-text("Create Board")').click()
        await expect(this.listSelector(name)).toHaveCount(1, { timeout: 5000 })
    }

    async updateBoardName(originalName: string, newName: string) {
        await this.page.locator(this.listSelectorString(originalName)).scrollIntoViewIfNeeded()
        await this.page.hover(this.listSelectorString(originalName))
        await this.page.locator(`${this.listSelectorString(originalName)} div[data-tip="Rename"]`).click()
        await this.page.locator('#rename_board_modal input[placeholder="New board name"]').fill(newName)
        await this.page.locator('button:has-text("Rename Board")').click()
    }

    async deleteBoard(name: string) {
        this.page.on('dialog', dialog => dialog.accept());
        await this.page.locator(this.listSelectorString(name)).scrollIntoViewIfNeeded()
        await this.page.hover(this.listSelectorString(name))
        await this.page.locator(`${this.listSelectorString(name)} div[data-tip="Delete"]`).click()
    }

    async gotoScreenshotView() {
        await this.page.goto(`/#/boards/${this.boardId()}/screenshot`)
        await expect(this.page.locator('screenshot-container')).toHaveCount(1)
    }

    boardId() {
        const match = this.page.url().match(/\/boards\/(.*)/);
        if (!match) {
            throw new Error('Board ID not found')
        }

        return match[1]
    }

    boardTitle(name: string) {
        return this.page.locator(`h2:has-text("${name}")`)
    }

    listSelector(name: string) {
        return this.page.locator(this.listSelectorString(name))
    }

    boardListIndex(index: number) {
        return this.page.locator(`.drawer-side ul li:nth-child(${index + 1})`)
    }

    listSelectorString(name: string) {
        return `.drawer-side ul li:has-text("${name}")`
    }

    createBoardButton() {
        return this.page.locator('div[data-tip="Create new board"]')
    }

    randomName() {
        return `My new board ${crypto.randomBytes(5).toString('hex')}`
    }
}
