const fs = require('fs');

function start(environmentFileSource, typingsFileDestination) {
    const environmentVariables = fs.readFileSync(environmentFileSource).toString()
        .split('\n')
        .filter((line) => { return (line) ? true : false; })
        .map((line) => { return line.split('=')[0] });
    const variables = environmentVariables.reduce((acc, current) => { return `${acc}${current}:string;` }, '');

    const fileExists = fs.existsSync(typingsFileDestination);

    const template = fs.readFileSync(`${__dirname}/template`).toString();
    if (fileExists) {
        const existingTypes = fs.readFileSync(typingsFileDestination).toString();
        const preTemplate = template.split('${VARIABLES}')[0];
        const postTemplate = template.split('${VARIABLES}')[1];

        const preStartIndex = existingTypes.indexOf(preTemplate);
        if (preStartIndex === -1) {
            fs.appendFileSync(typingsFileDestination, template.replace('${VARIABLES}', variables));
            return;
        }
        const preStartText = existingTypes.substring(0, preStartIndex);

        const postStartText = existingTypes.substring(preStartIndex);

        const start =  postStartText.indexOf(preTemplate) + preTemplate.length;
        const end = postStartText.indexOf(postTemplate);
        fs.writeFileSync(typingsFileDestination, `${preStartText}${postStartText.replace(postStartText.substring(start, end), variables)}`);

    }
    else {
        fs.writeFileSync(typingsFileDestination, template.replace('${VARIABLES}', variables));
    }
}

module.exports = start;