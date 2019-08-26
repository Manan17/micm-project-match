import React, { Component } from 'react';
import Loader from 'Src/modules/Loader';

const asyncComponent = importComponent =>
  class asyncComponentHOC extends Component {
    state = {
      component: null
    };

    componentDidMount() {
      this.mounted = true;
      importComponent().then(cmp => {
        if (this.mounted) this.setState({ component: cmp.default });
      });
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const C = this.state.component;
      return C ? (
        <C {...this.props} />
      ) : (
        <div className="load-indicator">
          <Loader />
        </div>
      );
    }
  };

export default asyncComponent;
