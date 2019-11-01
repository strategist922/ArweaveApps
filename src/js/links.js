String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

class Links {
    static CATEGORIES() {
        return [
            "games",
            "gambling",
            "social",
            "finance",
            "development",
            "media",
            "wallet",
            "stores",
            "security",
            "governance",
            "property",
            "storage",
            "identity",
            "energy",
            "health"
        ];
    }

    constructor() {
        this._data = [];
        this._dataById = new Map();
        this._appIcon = '';
        this._contentLoaded = false;

        this._categories = new Set();

        for(let i = 0, j = Links.CATEGORIES().length; i < j; i++) {
            this._categories.add(Links.CATEGORIES()[i]);
        }

        this._workers = operative({
            sortByVotes: function(data) {
                this.deferred().fulfill(data.sort((a, b) => a.votes.length < b.votes.length? 1 : a.votes.length > b.votes.length? -1 : 0));
            },
            createDataById: function(data) {
                const dataById = new Map();
                for(let i = 0, j = data.length; i < j; i++) {
                    dataById.set(data[i].id, data[i]);
                }

                this.deferred().fulfill(dataById);
            },
            getUserPermawebs: function(options) {
                const optionsHtml = ['<option disabled selected>Select your permaweb</option>'];
                options.forEach((option) => {
                    let title = option.data.match(/<title[^>]*>([^<]+)<\/title>/);
                    if(title && title.length > 1) {
                        title = title[1];
                    } else {
                        title = "untitledlink";
                    }
                    optionsHtml.push(`<option value="${option.id}">${title} (${option.id})</option>`);
                });

                this.deferred().fulfill(optionsHtml);
            },
            convertAllToHtml: function(data) {
                const {dataById, categories} = data;
                const _categories = new Map();

                function toSlug(str) {
                    str = str.replace(/^\s+|\s+$/g, ''); // trim
                    str = str.toLowerCase();

                    // remove accents, swap ñ for n, etc
                    const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
                    const to   = "aaaaaeeeeeiiiiooooouuuunc------";
                    for (let i=0, l=from.length ; i<l ; i++) {
                        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
                    }

                    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
                      .replace(/\s+/g, '-') // collapse whitespace and replace by -
                      .replace(/-+/g, '-'); // collapse dashes

                    return str;
                }

                const gradients = [
                    'background: #9D7AF7;\n' +
                    'background: -webkit-linear-gradient(right, #9D7AF7, #1192B1);\n' +
                    'background: -moz-linear-gradient(right, #9D7AF7, #1192B1);\n' +
                    'background: linear-gradient(to left, #9D7AF7, #1192B1);',

                    'background: #E04A82;\n' +
                    'background: -webkit-linear-gradient(right, #E04A82, #5A2B57);\n' +
                    'background: -moz-linear-gradient(right, #E04A82, #5A2B57);\n' +
                    'background: linear-gradient(to left, #E04A82, #5A2B57);',

                    'background: #005179;\n' +
                    'background: -webkit-linear-gradient(right, #005179, #7A5CBA);\n' +
                    'background: -moz-linear-gradient(right, #005179, #7A5CBA);\n' +
                    'background: linear-gradient(to left, #005179, #7A5CBA);',

                    'background: #95D5F1;\n' +
                    'background: -webkit-linear-gradient(right, #95D5F1, #255A4A);\n' +
                    'background: -moz-linear-gradient(right, #95D5F1, #255A4A);\n' +
                    'background: linear-gradient(to left, #95D5F1, #255A4A);',

                    'background: #E37A5E;\n' +
                    'background: -webkit-linear-gradient(right, #E37A5E, #8907D6);\n' +
                    'background: -moz-linear-gradient(right, #E37A5E, #8907D6);\n' +
                    'background: linear-gradient(to left, #E37A5E, #8907D6);',

                    'background: #93F74A;\n' +
                    'background: -webkit-linear-gradient(right, #93F74A, #327093);\n' +
                    'background: -moz-linear-gradient(right, #93F74A, #327093);\n' +
                    'background: linear-gradient(to left, #93F74A, #327093);',

                    'background: #6E3AF9;\n' +
                    'background: -webkit-linear-gradient(right, #6E3AF9, #140E1E);\n' +
                    'background: -moz-linear-gradient(right, #6E3AF9, #140E1E);\n' +
                    'background: linear-gradient(to left, #6E3AF9, #140E1E);',

                    'background: #E7C8C3;\n' +
                    'background: -webkit-linear-gradient(right, #E7C8C3, #645427);\n' +
                    'background: -moz-linear-gradient(right, #E7C8C3, #645427);\n' +
                    'background: linear-gradient(to left, #E7C8C3, #645427);',

                    'background: #BEB5C0;\n' +
                    'background: -webkit-linear-gradient(right, #BEB5C0, #73585F);\n' +
                    'background: -moz-linear-gradient(right, #BEB5C0, #73585F);\n' +
                    'background: linear-gradient(to left, #BEB5C0, #73585F);',

                    'background: #0F7559;\n' +
                    'background: -webkit-linear-gradient(right, #0F7559, #949862);\n' +
                    'background: -moz-linear-gradient(right, #0F7559, #949862);\n' +
                    'background: linear-gradient(to left, #0F7559, #949862);',

                    'background: #4D0F98;\n' +
                    'background: -webkit-linear-gradient(right, #4D0F98, #119467);\n' +
                    'background: -moz-linear-gradient(right, #4D0F98, #119467);\n' +
                    'background: linear-gradient(to left, #4D0F98, #119467);',

                    'background: #293171;\n' +
                    'background: -webkit-linear-gradient(right, #293171, #647B82);\n' +
                    'background: -moz-linear-gradient(right, #293171, #647B82);\n' +
                    'background: linear-gradient(to left, #293171, #647B82);',

                    'background: #F8D353;\n' +
                    'background: -webkit-linear-gradient(right, #F8D353, #FF5C5A);\n' +
                    'background: -moz-linear-gradient(right, #F8D353, #FF5C5A);\n' +
                    'background: linear-gradient(to left, #F8D353, #FF5C5A);',

                    'background: #D74F80;\n' +
                    'background: -webkit-linear-gradient(right, #D74F80, #9241B5);\n' +
                    'background: -moz-linear-gradient(right, #D74F80, #9241B5);\n' +
                    'background: linear-gradient(to left, #D74F80, #9241B5);',

                    'background: #CBC988;\n' +
                    'background: -webkit-linear-gradient(right, #CBC988, #3F7890);\n' +
                    'background: -moz-linear-gradient(right, #CBC988, #3F7890);\n' +
                    'background: linear-gradient(to left, #CBC988, #3F7890);',

                    'background: #B35D34;\n' +
                    'background: -webkit-linear-gradient(right, #B35D34, #958B2A);\n' +
                    'background: -moz-linear-gradient(right, #B35D34, #958B2A);\n' +
                    'background: linear-gradient(to left, #B35D34, #958B2A);'
                ];

                let html = '';
                dataById.forEach(async link => {
                    const isCategory = categories.findIndex(l => l.toLowerCase() === link.category.toLowerCase());
                    if(isCategory === -1) return true;

                    let collection = '';
                    if(_categories.has(link.category)) {
                        collection = _categories.get(link.category);
                    } else {
                        collection = `<div data-category="${link.category}" class="col s12"><h5 class="white-text" style="${gradients[isCategory]}; margin: 0; margin-bottom: -7px; padding: 15px 10px;">${link.category.toUpperCase()}</h5><ul class="collection">`;
                    }

                    const img = link.appIcon ? `<img src="${link.appIcon}" alt="${link.title}" />` : '<img class="empty-img" />';

                    collection += `
                    <li class="collection-item avatar" data-id="${link.id}" data-linkid="${link.linkId}" data-repository="${toSlug(link.fromUser)}/${toSlug(link.title)}">
                        <div class="secondary-content center-align">
                            <a href="#" class="js-vote material-icons">arrow_drop_up</a>
                            <span class="app-votes">${link.votes.length}</span>
                        </div>
                    
                        <a href="https://arweave.net/${link.linkId}" target="_blank" rel="nofollow" class="js-addy-link">
                            ${img}
                            <div class="title"><span style="max-width: 100px; float: left;" class="truncate">${link.fromUser}</span> <span style="margin-left: 5px">/ ${link.title}</span></div>
                            <small>${link.description}</small>
                        </a>
                    </li>`;

                    _categories.set(link.category, collection);
                });

                const catsData = Array.from(_categories);
                catsData.sort((a, b) => a[0] > b[0]? 1 : a[0] < b[0]? -1 : 0);
                catsData.forEach(cat => {
                    html += `${cat[1]}</ul></div>`;
                });

                this.deferred().fulfill(html);
            }
        });
    }

    init() {
        this._events();
        this.showAll().catch(console.log);
        this._showCategories();
    }

    toSlug(str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
        const to   = "aaaaaeeeeeiiiiooooouuuunc------";
        for (let i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
          .replace(/\s+/g, '-') // collapse whitespace and replace by -
          .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    async getAll() {
        const query = {
            query: `{
            transactions(tags: [{name: "App-Name", value: "arweaveapps"}, {name: "Type", value: "publish"}]) {
              id,
                votes: linkedFromTransactions(byForeignTag: "Link-Id", tags: [{name: "App-Name", value: "arweaveapps"}, {name: "Type", value: "vote"}]) {
                id
              }
            }
          }`
        };

        console.time('fetching apps');
        const res = await arweave.api.post(`arql`, query);
        console.timeEnd('fetching apps');

        this._data = [];
        const transactions = res.data.data.transactions;

        console.time('grabbing app details');
        for(let i = 0, j = transactions.length; i < j; i++) {
            const id = transactions[i].id;

            let storedData = window.localStorage.getItem(`${app.appVersion}-${id}`);
            if(storedData) {
                this._data.push(JSON.parse(storedData));
                continue;
            }

            let txRow = {};
            const tx = await arweave.transactions.get(id);

            const jsonData = tx.get('data', {decode: true, string: true});
            const data = JSON.parse(jsonData);

            txRow['title'] = data.title;
            txRow['id'] = id;
            txRow['appIcon'] = data.appIcon;
            txRow['from'] = await arweave.wallets.ownerToAddress(tx.owner);
            txRow['linkId'] = data.linkId;
            txRow['description'] = data.description;

            tx.get('tags').forEach(tag => {
                let key = tag.get('name', { decode: true, string: true });
                let value = tag.get('value', { decode: true, string: true });
                txRow[key.toLowerCase()] = value
            });

            const tmpVotes = new Set();
            for(let k = 0, l = transactions[i].votes.length; k < l; k++) {
                tmpVotes.add(transactions[i].votes[k].id);
            }
            txRow['votes'] = Array.from(tmpVotes);

            this._data.push(txRow);

            try {
                window.localStorage.setItem(`${app.appVersion}-${id}`, JSON.stringify(txRow));
            } catch (e) {}

        }
        console.timeEnd('grabbing app details');
        console.log(this._data);

        this._dataById = new Map();
        console.time('filtering apps');
        if(this._data.length) {
            // Remove old versions of a project and only work with the latest versions
            const tmp = [];
            const tmpSet = new Set();
            for(let i = 0, j = this._data.length; i < j; i++) {
                if(!tmpSet.has(`${this._data[i].title.toLowerCase()}-${this._data[i].from}`) && this._categories.has(this._data[i].category)) {
                    this._data[i].fromUser = this._data[i].from;
                    tmp.push(this._data[i]);
                    tmpSet.add(`${this._data[i].title.toLowerCase()}-${this._data[i].from}`);
                }
            }

            // Sort by votes
            this._data = await this._workers.sortByVotes(tmp);
            this._dataById = await this._workers.createDataById(this._data);
        }
        console.timeEnd('filtering apps');

        return this._data;
    }

    async getAllLinksByAccount(address) {
        const query = {
            op: 'and',
            expr1: {
                op: 'equals',
                expr1: 'from',
                expr2: address
            },
            expr2: {
                op: 'or',
                expr1: {
                    op: 'equals',
                    expr1: 'Content-Type',
                    expr2: 'text/html'
                },
                expr2: {
                    op: 'equals',
                    expr1: 'Content-Type',
                    expr2: 'application/x.arweave-manifest+json'
                }
            }
        };

        console.time('grabbing user apps');
        const res = await arweave.api.post('arql', query);
        console.timeEnd('grabbing user apps');

        return res.data;
    }

    async showAll() {
        //await votes.getAllVotes();
        console.time('getAll');
        await this.getAll();
        console.timeEnd('getAll');

        console.time('grabbing html');
        const html = await this._workers.convertAllToHtml({dataById: this._dataById, categories: Links.CATEGORIES()});
        console.timeEnd('grabbing html');
        $('.js-app-list').html(html);

        console.time('filling images');
        $('.empty-img').each((i, e) => {
            const hash = $(e).parents('.collection-item').first().data('linkid');
            const icon = hashicon(hash, 42);

            $(e).attr('src', icon.toDataURL("image/png"));
        });
        console.timeEnd('filling images');
        this._contentLoaded = true;
    }

    async showAllLinksByAccount(address) {
        const linksId = await this.getAllLinksByAccount(address);

        let options = [];

        for(let i = 0, j = linksId.length; i < j; i++) {
            options.push(`<option>${linksId[i]}</option>`);
        }

        $('#link-link').html(options);
        $('select').formSelect();
    }

    async publish() {
        if(!accounts.loggedIn) {
            accounts.showLogin();
            return M.toast({html: 'Login and then hit publish again.'});
        }

        // Validate that all the fields are valid and filled
        const title = this._htmlToTxt($.trim("" + $('#link-title').val()));
        const category = this._htmlToTxt($.trim("" + $('#link-category').val())).toLowerCase();
        const linkId = this._htmlToTxt($.trim("" + $('#link-link').val()));
        const description = this._htmlToTxt($.trim("" + $('#link-description').val()));

        if(title.length < 3 || title.length > 25) {
            return M.toast({html: 'The app title must be between 3 and 25 characters.'});
        }

        if(!this._categories.has(category)) {
            return M.toast({html: 'Invalid category.'});
        }

        if(description.length < 10 || description.length > 140) {
            return M.toast({html: 'The description must be between 10 and 140 characters.'});
        }

        if(linkId.length !== 43) {
            return M.toast({html: 'Invalid App ID.'});
        }

        const data = {
            title,
            category,
            linkId,
            appIcon: this._appIcon,
            description
        };

        const tx = await arweave.createTransaction({ data: JSON.stringify(data) }, accounts.wallet);

        tx.addTag('App-Name', app.appName);
        tx.addTag('App-Version', app.appVersion);
        tx.addTag('Unix-Time', Math.round((new Date()).getTime() / 1000));
        tx.addTag('Type', 'publish');
        tx.addTag('Category', category);

        await arweave.transactions.sign(tx, accounts.wallet);
        console.log(tx.id);
        await arweave.transactions.post(tx);

        return M.toast({html: 'App sent, will be available after one block.'});
    }

    addVote(address, id) {
        const link = this._dataById.get(id);
        link.votes.push({from: address});
        this._dataById.set(id, link);

        for(let i = 0, j = this._data.length; i < j; i++) {
            if(this._data[i].id === id) {
                this._data[i].votes.push({from: address});
            }
        }
    }

    _imageConvert(file) {
        const reader = new FileReader();
        reader.onload = img => {
            $(`#link-icon`).html(`<img src="${img.target.result}" width="80" height="80" />`);
            this._appIcon = img.target.result;
        };
        reader.readAsDataURL(file);
    }

    _showCategories() {
        const optionsHtml = ['<option value="" disabled selected>Choose a category</option>'];
        Links.CATEGORIES().forEach(category => {
            optionsHtml.push(`<option>${category.capitalize()}</option>`);
        });
        $('#link-category').html(optionsHtml);
        $('select').formSelect();
    }

    _htmlToTxt(str) {
        return $(`<div>${str}</div>`).text();
    }

    _events() {
        $('#link-title, #link-description').characterCounter();

        $('#link-icon').on('click', e => {
            e.preventDefault();
            $('#imgfile').trigger('click');
        });

        $('#imgfile').on('change', (e) => {
            this._imageConvert(e.target.files[0]);
        });

        $('#publish-form').on('submit', e => {
            e.preventDefault();

            this.publish();
        });

        $('.js-go-publish').on('click', e => {
            if(!accounts.loggedIn) {
                M.toast({html: 'Login to publish a link'});
                accounts.showLogin();
            }
        });
    }

    get data() {
        return this._data;
    }

    get dataById() {
        return this._dataById;
    }

    get contentLoaded() {
        return this._contentLoaded;
    }
}
const links = new Links();
