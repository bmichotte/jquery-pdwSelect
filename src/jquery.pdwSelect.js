/*
 * Copyright (c) 2013 Benjamin Michotte <benjamin@produweb.be>
 *     ProduWeb SA <http://www.produweb.be>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is furnished
 * to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
if (jQuery)
{
    (function($)
    {
        $.fn.pdwSelect = function(method)
        {
            var options = $(this).data('options');
            if (methods[method])
            {
                return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
            }
            else if (typeof method === 'object' || !method)
            {
                return methods.init.apply(this, arguments);
            }
            else
            {
                $.error('Method ' + method + ' does not exist on jQuery.pdwSelect');
                return null;
            }
        };

        var methods =
        {
            init: function(userOptions)
            {
                var options =
                {
                    parentClass: "pdw-select",
                    spanClass: "pdw-select-span",
                    buttonClass: "pdw-button",
                    ulClass: "pdw-select-ul",
                    liClass: "pdw-select-ul-li",
                    aClass: "pdw-select-ul-li-a",
                    onReplaced: false
                };
                $.extend(true, options, userOptions || {});

                return this.each(function()
                {
                    $(this).data('options', options);
                    $(this).pdwSelect('replace');
                });
            },
            replace: function()
            {
                $(this).hide();

                var select = $(this),
                    options = select.data('options'),
                    parent = $('<div />')
                        .addClass(options.parentClass)
                        .appendTo(select.parent()),
                    span = $('<span />')
                        .addClass(options.spanClass)
                        .appendTo(parent)
                        .click(function()
                        {
                            $(this).next('button').trigger('click');
                        }),
                    button = $('<button />')
                        .addClass(options.buttonClass)
                        .appendTo(parent)
                        .html("V")
                        .click(function(e)
                        {
                            e.stopPropagation();
                            e.preventDefault();

                            var visible = ul.is(':visible');
                            $('.pdw-select-ul').hide();

                            if (! visible)
                            {
                                ul.show();
                            }
                        }),
                    ul = $('<ul />')
                        .addClass(options.ulClass)
                        .appendTo(parent)
                        .hide(),
                    val;
                if (select.val())
                {
                    val = select.find('option[value=' + select.val() + ']').html()
                }
                else
                {
                    val = select.find('option:first-child').html()
                }
                if (val)
                {
                    span.html(val);
                }

                select.change(function()
                {
                    var selected = ul.find('[data-val=' + $(this).val() + ']');
                    span.html(selected.html());
                });

                $.each(select.children('option'), function(i, n)
                {
                   var li = $('<li />')
                           .addClass(options.liClass)
                           .appendTo(ul)
                           .click(function(e)
                           {
                               e.preventDefault();
                               $(this).find('a').trigger('click');
                           }),
                       a = $('<a />')
                           .addClass(options.aClass)
                           .click(function(e)
                           {
                               e.stopPropagation();
                               e.preventDefault();
                               span.html($(this).html());
                               select.val($(this).attr('data-val')).trigger('change');
                               ul.hide();
                           })
                           .html($(n).html())
                           .attr('data-val', $(n).val())
                           .appendTo(li);
                });

                if (options.onReplaced && typeof options.onReplaced == 'function')
                {
                    options.onReplaced.apply(select);
                }
            }
        };
    })(jQuery);
}