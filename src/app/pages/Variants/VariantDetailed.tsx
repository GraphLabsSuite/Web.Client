import {Component} from "react";
import {RootState} from "../../../redux/rootReducer";
import {actions} from "../../../redux/actions";
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import {VariantsData} from "../../../redux/reducers/variants";
import {InjectedAuthRouterProps} from "redux-auth-wrapper/history3/redirect";
import {ListGroupItem} from "reactstrap";
import * as React from "react";

interface Props extends RouteComponentProps<{}>, InjectedAuthRouterProps{
    variant: VariantsData
}

class VariantDetailed extends Component<Props> {

    public render() {
        const variant = this.props.variant;
        if (!variant) {return null}
        const variantData = variant.variantData;
        return (<>
            <ListGroupItem tag={'div'} style={{whiteSpace: 'pre', fontSize: '1.2em', fontFamily: "monospace"}} >
                {JSON.stringify(JSON.parse(variantData), null, 2)}
            </ListGroupItem>
            </>)
    }
}

const mapStateToProps = (state: RootState, props: any) => ({
    variant: state.variants.data
        .find(e => e.id ===
            parseInt(props.match.path.replace(/^.*\/variants\/([0-9]*?)(\/.*)?$/, "$1"), 10)
        )
});

const mapDispatchToProps = {
    getVariants: actions.getVariants
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VariantDetailed));