import {
  View,
  Text,
} from 'react-native';

import React, { Component, PropTypes } from 'react';


const Relay = require('react-relay');


function extractVariables(state, comp) {
  console.log(comp);
  return Object.keys(state).reduce((vars, name) => {
    if (comp.hasVariable(name)) {
      vars[name] = state[name];
    }
    return vars;
  }, {});
}

export default class RelayComponentRenderer extends Component {
  static propTypes = {
    component: PropTypes.object,
    navigationState: PropTypes.object,
  };

  render() {
    // extract needed variables from navigationState
    const variables = extractVariables(this.props.navigationState, this.props.component);


    return (<Relay.Renderer
      Container={this.props.component}
      queryConfig={{
        queries: this.props.navigationState.queries,
        params: variables,
        name: 'rn-router-flux-queries_' + Math.random(),
      }}
      environment={Relay.Store}
      render={({done, error, props, retry, stale}) => {
        if (error) {
          // render error
          return (<View style={{padding: 30}}>
            <Text>Error while fetching data from the server</Text>
            <Button onPress={retry}>
              <Text>Retry?</Text>
            </Button>
          </View>);
        }

        if (props) {
        // render component itself
          return (
            <this.props.component {...props} />
          );
        }

        // render loading
        return (<View>
          <Text>Loading...</Text>
        </View>);
      }}
    />);
  }
}
