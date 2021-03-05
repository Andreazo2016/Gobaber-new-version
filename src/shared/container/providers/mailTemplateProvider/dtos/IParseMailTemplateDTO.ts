interface ITemplateVariables {
    [key: string]: string | number;
}

export default interface IParseMailTemplateDTO {
    template?: string;
    templateFileContent?: string;
    variables: ITemplateVariables;
}