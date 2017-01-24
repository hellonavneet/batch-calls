let Q= require("q");

module.exports = {
/**
 * Batches call to the delegate in batchSize
 * @batchSize The batch size
 * @parameters An array of parameters, this array should be the size of total calls that are batched.
 *             Each delegate call will contain an item from the parameters at given index
 * @delegate The delegate to call * 
 */
batchExecute: (nodeFunc, parameters, batchSize, partial) => {
        if(!parameters || !nodeFunc) {
            return Q.reject("Invalid parameters or delegate value.");
        }
        //We allow 0 or more of batch size to allow for some integration scenarios
        if(batchSize < 0) {
        return Q.reject("Invalid batch size.");
        }

        if(batchSize > parameters.length) {
            return Q.reject("Not sufficient parameters");
        }
        
        let currentBatch = 1;
        return call(nodeFunc, parameters, batchSize, partial, currentBatch, []);
    }
}
function call(nodeFunc, parameters, batchSize, partial, currentBatch, outputs) {
        let totalBatches = Math.ceil(parameters.length/batchSize);
        let promises = [];
        let start = (currentBatch -1) * batchSize;
        let end = start+ batchSize;
        for(let i=start; i <start + batchSize && i <parameters.length;i++) {
            promises.push(Q.fcall(nodeFunc, ...parameters[i]));
        }
        let errors=[];
        return Q.allSettled(promises).then((results) => {
            let failed = false;
            for(let j=0;j<results.length;j++) {
                failed =  failed || results[j].state !== "fulfilled";
                    outputs.push({
                        state: results[j].state === "fulfilled",
                        value: results[j].value
                    });
            }

            if(failed && partial){
                return Q.reject(outputs);
            }

            if(currentBatch === totalBatches) {
                return Q(outputs);
            }
            return call(nodeFunc, parameters, batchSize, partial, currentBatch+1, outputs);
        });
}