import api from "./api";

const cmsService = {

    getCollections(params = {}){
        //Paramas: {featured}
        return api.get('/collections/')
    },

    getCollection(id) {
        return api.get(`/collections/${id}`)
    }

}

export default cmsService