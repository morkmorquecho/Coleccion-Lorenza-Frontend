import api from "./api";

const cmsService = {

    getCollections(params = {}){
        //Paramas: {featured}
        return api.get('/collections/',{params})
    },

    getCollection(id) {
        return api.get(`/collections/${id}`)
    }

}

export default cmsService