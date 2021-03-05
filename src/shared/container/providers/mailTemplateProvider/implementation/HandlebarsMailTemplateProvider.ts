import fs from 'fs'
import handlebars from 'handlebars'
import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO"
import IMailTemplateProvider from "../models/IMailTemplateProvider"

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
    public async parse({ template, templateFileContent, variables }: IParseMailTemplateDTO): Promise<string> {
        if (templateFileContent) {
            const templateFileContentParsed = await fs.promises.readFile(templateFileContent, {
                encoding: 'utf-8'
            })
            const parseTemplate = handlebars.compile(templateFileContentParsed)
            return parseTemplate(variables)
        }
        const parseTemplate = handlebars.compile(template)
        return parseTemplate(variables)
    }
}

export default HandlebarsMailTemplateProvider