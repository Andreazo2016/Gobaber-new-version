import ISendEmailDTO from '../dtos/ISendEmailDTO'
export default interface IMailProvider {
    sendEmail(data: ISendEmailDTO): Promise<void>;
}