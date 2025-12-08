export interface IMailService {
  sendEmail(
    to: string,
    subject: string,
    templateName: string,
    context: any
  ): Promise<void>;
}
