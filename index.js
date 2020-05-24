var copy            = require( "copy" );

module.exports = 
{
    // Extend website resources and html
    // website: 
    // {
    //     assets: "./book",
    //     js: [
    //         "test.js"
    //     ],
    //     css: [
    //         "test.css"
    //     ]
    // },

    // Extend templating blocks
    blocks: 
    {    
        pdf: 
        {
            process: function(block) 
            {
                var book = this;

                // Return nothing and warn if there's no source
                if( !block.kwargs.src )
                {
                    book.log.warn.ln( `Embed-pdf: no src attribute in pdf tag in file ${this.ctx.ctx.file.path}.` );
                    return ``;
                }

                // Construct URL
                var url = `${block.kwargs.src}`;
                var title = (block.kwargs.title) ? block.kwargs.title : '查看';

                // Construct the width/height
                var width = (block.kwargs.width) ? `width="${block.kwargs.width}"` : "";
                var height = (block.kwargs.width) ? `height="${block.kwargs.height}"` : "";

                // Construct download link
                var viewLink = "";
                if ( block.kwargs.link) {
                    viewLink = `<div class="pdf__link"><a target="_blank" href="${url}">${title}</a></div>`
                }

                // Construct the return html
                var html =  `<div class="pdf">
                                ${viewLink}
                                <object data="${url}" ${width} ${height} type="application/pdf">
                                    <embed src="${url}">
                                        <p>不支持嵌入的PDF对象: <a target="_blank" href="${url}">${title}</a></p>
                                    </embed>
                                </object>
                            </div>`;

                // Return the html
                return html;
            }
        }
    },

    // Hook process during build
    hooks: 
    {
        "init": function() 
        {
            var book = this;

            // Get the output assets dir
            var output_dir = `${book.output.root()}/assets`;

            // Copy all PDF's in assets to the build dir's assets
            copy('assets/**/*.pdf', output_dir, function(err, files)
            {
                // Handle error
                if (err) throw err;
                // Log
                book.log.info.ln( `Embed-pdf: copied over ${files.length} pdf files.` );
            });
        },
    }
};
