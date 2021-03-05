import nodemailer, { Transporter } from 'nodemailer'
import { inject, injectable } from 'tsyringe'
import ISendEmailDTO from '../dtos/ISendEmailDTO';
import IMailProvider from "../models/IMailProvider";

import IMailTemplateProvider from '@shared/container/providers/mailTemplateProvider/models/IMailTemplateProvider'


@injectable()
export default class EtherealMailProvider implements IMailProvider {

    private client: Transporter
    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider

    ) {
        this._init()
    }

    async _init() {
        const account = await nodemailer.createTestAccount();
        this.client = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass
            }
        })
    }
    public async sendEmail({ to, from, subject, templateData }: ISendEmailDTO): Promise<void> {

        const html = await this.mailTemplateProvider.parse(templateData)
        
        const info = await this.client.sendMail({
            from: {
                name: from?.name || 'Equipe GoBarber <equipe@gobarber.com.br>',
                address: from?.email || 'equipe@gobarber.com.br'
            },
            to: {
                name: to.name,
                address: to.email
            },
            subject,
            html
        })
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
}