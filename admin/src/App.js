import React, { useEffect, useState} from 'react';
import routes from './routes';
import { PrivateRoute } from './privateRoute';
import { Route, Switch } from "react-router-dom";
import NotFound from "views/NotFound/NotFound";
import { ENV } from '../src/config/config';

function App(props) {

  const routesArr = routes()
    return (
      <React.Fragment>
        <Switch>
          {
            routesArr?.map((route, index) => {
              // {console.log(routesArr,"routesArr")}
              if (route?.path) {
                return (
                  <PrivateRoute
                    key={index}
                    path={route?.path}
                    exact={route?.exact}
                    access={route?.access}
                    showInSideBar={route?.showInSideBar}
                    component={props => (
                      <route.layout {...props}>
                        <route.component {...props} />
                      </route.layout>
                    )}
                  />
                )
              }
              else {
                return (
                route.submenus.map((subroute, subkey) => {
                    if (subroute.path) {
                      return (
                        <PrivateRoute
                          key={index + subkey}
                          path={subroute.path}
                          exact={subroute.exact}
                          access={subroute.access}
                          component={props => (
                            <subroute.layout {...props}>
                              <subroute.component {...props} />
                            </subroute.layout>
                          )}
                        />
                      )
                    }
                    else {
                      return (
                        subroute.submenus.map((nestedsubroute, nestedsubkey) => {
                          return (
                            <PrivateRoute
                              key={index + nestedsubkey}
                              path={nestedsubroute.path}
                              exact={nestedsubroute.exact}
                              access={true}
                              component={props => (
                                <nestedsubroute.layout {...props}>
                                  <nestedsubroute.component {...props} />
                                </nestedsubroute.layout>
                              )}
                            />
                          )
                        })
                      )
                    }
                  })
                )
              }
            })
          }
          <Route component={NotFound} />
        </Switch>
      </React.Fragment>
    )
}
export default App;