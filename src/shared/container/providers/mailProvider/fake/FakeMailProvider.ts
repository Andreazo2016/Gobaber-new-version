import ISendEmailDTO from "../dtos/ISendEmailDTO";
import IMailProvider from "../models/IMailProvider";

export default class FakeMailProvider implements IMailProvider {
    private messages: ISendEmailDTO[] = []
    public async sendEmail(message: ISendEmailDTO): Promise<void> {
        this.messages.push(message)
    }
}