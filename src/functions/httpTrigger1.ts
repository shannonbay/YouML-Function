import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import pug from "pug";
import path from "path";

export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    try {
        // Define the path to your Pug template
        const templatePath = path.join(__dirname, "views", "index.pug");

        // Compile the Pug template
        const compiledFunction = pug.compileFile(templatePath);

        // Generate HTML with the compiled template
        const html = compiledFunction({
            name: request.query.get('name') || await request.text() || 'world'
        });

        // Return the rendered HTML as the response
        return {
            headers: { "Content-Type": "text/html" },
            body: html,
        };
    } catch (error) {
        context.error('Error rendering Pug template:', error);
        return {
            status: 500,
            body: 'An error occurred while rendering the page.',
        };
    }
};

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    route: '/',
    handler: httpTrigger1
});
