import  {ENV}  from 'config/config';
import routes from '../../routes';

const PermissionsArray =  () =>  {
    const routesArr = routes()
    function pathFunction() {
        const pathValue = routesArr?.map((route) => {
            if(route?.showInSideBar === true || route?.exceptional === true) {
                    if(route?.path){
                        let pathValue;
                        return(
                            pathValue = route?.path
                        )
                    } else {
                        return (
                            route?.submenus?.map((subroute) => {
                                if(subroute?.showInSideBar === true) {
                                    if(subroute?.path){
                                        let pathValue;
                                        return(
                                            pathValue = subroute?.path
                                        )
                                    }
                                }
                            })
                        )
                    }
            } 
        })
        return pathValue
    }
    var filtered = pathFunction(routesArr).filter(function(x) {
        return x !== undefined;
    });
    function flattenList(nestedArr) {
        let newFlattenList = [];
      
        const handleFlat = (array) => {
          let count = 0;
          while (count < array.length) {
            let item = array[count];
            if (Array.isArray(item)) {
              handleFlat(item);
            } else {
              newFlattenList.push(item);
            }
            count++;
          }
        };
        handleFlat(nestedArr);
        return newFlattenList;
    }
    const output = flattenList(filtered)
    //console.log(`permissions array output is ==>`, output)
    return output;
  }
  export default PermissionsArray;
