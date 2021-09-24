import {Component, ReactNode, SyntheticEvent} from "react";
import {Route, RouteComponentProps, withRouter} from "react-router";
import {InjectedAuthRouterProps} from "redux-auth-wrapper/history3/redirect";
import {
    Button, ButtonDropdown,
    Col,
    Container, DropdownItem,
    DropdownMenu,
    DropdownToggle,
    ListGroup,
    ListGroupItem,
    Row
} from "reactstrap";
import * as React from "react";
import {NavLink, Link} from "react-router-dom";
import {RootState} from "../../../redux/rootReducer";
import {actions} from "../../../redux/actions";
import {connect} from "react-redux";
import AsyncWrapper from "../../containers/AsyncWrapper";
import {VariantsState} from "../../../redux/reducers/variants";
import VariantDetailed from "./VariantDetailed";
import './Variants.css';
import {AppState} from "../../../redux/reducers/state";
import {ModuleData} from "../../../redux/reducers/modules";


interface VariantsProps {
    state: AppState,
    variants: VariantsState,
    getVariants: typeof actions.getVariants,
    getModules: typeof actions.getModules,
    modules: ModuleData[],
    deleteVariant: typeof actions._deleteVariant
}

type Props = VariantsProps & RouteComponentProps<{}> & InjectedAuthRouterProps

interface State {
    isDropdownOpen: boolean
}

class Variants extends Component<Props, State> {

    public state = {
        isDropdownOpen: false,
        currentDropdownOption: undefined
    };

    constructor(props: Props) {
        super(props);
        this.handleDropdownToggle = this.handleDropdownToggle.bind(this);
        this.handleDropdownClick = this.handleDropdownClick.bind(this);
    }

    public componentDidMount(): void {
        if ((new URLSearchParams(this.props.location.search)).get("moduleId")) {
            this.props.getVariants((new URLSearchParams(this.props.location.search)).get("moduleId") as string);
        } else {
            this.props.getVariants();
        }
        this.props.getModules();
    }

    public get admin(): boolean {
        if (this.props.state.userData) {
            return this.props.state.userData.role === 'Teacher';
        }
        return false;
    }

    public render(): ReactNode {
        return (<Container>
            <AsyncWrapper state={[this.props.variants]}>
                <Row>
                    <Col md={{
                        size: 8,
                        offset: 1
                    }}
                         style={{marginLeft: "0"}}>
                        <h1>
                            Варианты
                        </h1>
                    </Col>
                </Row>
                <Row>
                    <Col md={{
                        size: 6,
                    }}>
                        {this.admin &&
                        <Button tag={Link} to="/variants/edit" outline color="secondary">Создать новый</Button>}
                    </Col>
                    <Col md={{
                        size: 6
                    }}
                         style={{textAlign: "right"}}>
                        <ButtonDropdown isOpen={this.state.isDropdownOpen} toggle={this.handleDropdownToggle}
                                        outline color="secondary" style={{marginRight: "0"}}>
                            <DropdownToggle outline color="secondary" className={"generate"} caret>
                                {(this.props.modules.find(m => "" + m.id === (new URLSearchParams(this.props.location.search)).get("moduleId")) || {name: "Все"}).name}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem
                                    onClick={this.handleDropdownClick(undefined)}
                                >
                                    Все
                                </DropdownItem>
                                {this.props.modules.map(m =>
                                    <DropdownItem
                                        key={m.id}
                                        onClick={this.handleDropdownClick(m.id)}
                                    >
                                        {m.name}
                                    </DropdownItem>)}
                            </DropdownMenu>
                        </ButtonDropdown>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <ListGroup>
                            {this.props.variants.data.map(e => (
                                <>
                                    <ListGroupItem className={"variant"} tag={NavLink}
                                                   to={location.pathname === `/variants/${e.id}` ? "/variants" : `/variants/${e.id}`}>
                                        {e.taskModule.name}: {e.name}
                                        <Link className={"pics"} to={`/variants/${e.id}/edit`}
                                              style={{right: "40px", position: "absolute", top: "calc(50% - 19px)"}}>
                                            &#9998;
                                        </Link>
                                        <Link className={"pics"} to={`#`} onClick={this.deleteVariant(e.id)}
                                              style={{right: "15px", position: "absolute", top: "calc(50% - 19px)"}}>
                                            🗙
                                        </Link>
                                    </ListGroupItem>
                                    <Route path={`/variants/${e.id}`} component={VariantDetailed}/>
                                </>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </AsyncWrapper>
        </Container>)
    }

    private deleteVariant(id: number) {
        return (e: SyntheticEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (confirm(`Вы уверены, что хотиту удалить вариант ${this.props.variants.data.filter(v => v.id === id)[0].name}?`)) {
                this.props.deleteVariant(id, (new URLSearchParams(this.props.location.search)).get("moduleId") as any);
            }
        }
    }

    private handleDropdownToggle() {
        this.setState({
            isDropdownOpen: !this.state.isDropdownOpen
        })
    }

    private handleDropdownClick(id?: number) {
        return () => {
            this.props.history.push(this.props.location.pathname + (id ? "?moduleId=" + id : ""));
        }
    }
}

const mapStateToProps = (state: RootState) => ({
    variants: {
        ...state.variants,
        data: state.variants.data.sort((e1, e2) => `${e1.taskModule.name}: ${e1.name}`.localeCompare(`${e2.taskModule.name}: ${e2.name}`))
    },
    modules: state.modules.data,
    state: state.state
});

const mapDispatchToProps = {
    getVariants: actions.getVariants,
    getModules: actions.getModules,
    deleteVariant: actions._deleteVariant
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Variants));