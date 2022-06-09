import  {ENV}  from 'config/config';
import routes from '../../routes';

const RedirectPath =  () =>  {
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
    let firstIndex = filtered[0];
    function pathCheck() {
        var result;
        if( Array.isArray(firstIndex)  && firstIndex.length>1) {
            result = firstIndex[0];
        } else {
            result = firstIndex
        }
        return result
    }
    var result = pathCheck(firstIndex);
    return result;
  }
  export default RedirectPath;
