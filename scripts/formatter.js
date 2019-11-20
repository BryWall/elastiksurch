const object =  require('../data/customers_full');

function formatter(objects){
    const json_object = [];
    objects.forEach( o => {
        json_object.push(
        {
            'index' : o.index
        },{
            'object': o
        }
    );
    });
    const json = JSON.stringify(json_object);
    console.log(json);
    return json;
}

formatter(object);