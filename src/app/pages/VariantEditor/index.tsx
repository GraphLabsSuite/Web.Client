import * as React from "react";
import {Component, ReactNode} from "react";
import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import {RouteComponentProps, withRouter} from "react-router";
import {InjectedAuthRouterProps} from "redux-auth-wrapper/history3/redirect";
import {RootState} from "../../../redux/rootReducer";
import {actions} from "../../../redux/actions";
import {connect} from "react-redux";
import {VariantData} from "../../../redux/reducers/results";
import {
    Button,
    ButtonDropdown,
    Col,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Input,
    Nav,
    NavItem,
    NavLink,
    Row,
    TabContent,
    TabPane
} from "reactstrap";
import './VariantEditor.css';
import {ModuleData} from "../../../redux/reducers/modules";

interface VariantsProps {
    variant: VariantData,
    getVariants: () => void,
    modules: ModuleData[],
    getModules: () => void,
    saveVariant: typeof actions.saveVariant
}

interface State {
    vertexAmount: number,
    edgesAmount: number,
    value: string,
    moduleId: number,
    name: string,
    isDropdownOpen: boolean,
    isDropdownOpen2: boolean,
    labels: {
        label1: string,
        label2: string,
        structButton: string
    },
    structToGenerate: string,
    currentDropdownOption: string,
    tabIndex: string
}

type Props = VariantsProps & RouteComponentProps<{id: string}> & InjectedAuthRouterProps

class VariantEditor extends Component<Props, State> {

    public static defaultProps: Partial<Props> = {
        variant: {} as VariantData
    };

    public state = {
        isDropdownOpen: false,
        isDropdownOpen2: false,
        moduleId: 1,
        name: "",
        currentDropdownOption: "Граф с обозначением вершин",
        vertexAmount: 5,
        edgesAmount: 6,
        value: "Здесь еще ничего нет",
        labels: {
            label1: "Количество вершин",
            label2: "Количество ребер",
            structButton: "Генерировать структуру графа"
        },
        structToGenerate: "graphV",
        tabIndex: "1"
    };

    constructor(props: Props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.updateVertex = this.updateVertex.bind(this);
        this.updateEdge = this.updateEdge.bind(this);
        this.handleDropdownToggle = this.handleDropdownToggle.bind(this);
        this.getOptionHandler = this.getOptionHandler.bind(this);
        this.triggerTab = this.triggerTab.bind(this);
        this.handleAddButtonClick = this.handleAddButtonClick.bind(this);
        this.chooseModule = this.chooseModule.bind(this);
        this.handleModuleDropdownClick = this.handleModuleDropdownClick.bind(this);
        this.saveVariant = this.saveVariant.bind(this);
        this.updateName = this.updateName.bind(this);
    }

    public componentDidMount() {
        this.props.getVariants();
        this.props.getModules();
    }

    public componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.props.variant) {
            if ((prevProps.variant).variantData !== this.props.variant.variantData) {
                this.setState({
                    value: this.props.variant.variantData,
                    name: this.props.variant.name
                })
            }
        }
    }


    public render(): ReactNode {
        return <Container fluid style={{marginTop: "50px"}}>
            <Row>
                <Col sm={{
                    size: 4,
                    offset: 1
                }}>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                active={this.state.tabIndex === '1'}
                                onClick={this.triggerTab('1')}
                            >
                                JSON Editor
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={this.state.tabIndex === '2'}
                                onClick={this.triggerTab('2')}
                            >
                                Editor
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                active={this.state.tabIndex === '3'}
                                onClick={this.triggerTab('3')}
                            >
                                Справка
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={this.state.tabIndex}>
                        <TabPane tabId="1">
                            <AceEditor
                                mode="json"
                                theme="github"
                                value={this.state.value}
                                onChange={this.handleChange}
                                name="UNIQUE_ID_OF_DIV"
                                width={"100%"}
                                height={"55vh"}
                            />
                        </TabPane>
                        <TabPane tabId="2">
                            <div style={{width: "100%", height: "55vh", border: "1px solid #5c7e94"}}>
                                <></>
                            </div>
                        </TabPane>
                        <TabPane tabId="3">
                            <div style={{width: "100%", height: "55vh", border: "1px solid #5c7e94"}}>
                                <div style={{margin: "8px", fontSize: "90%"}}>
                                    <p>При сохранении нового варианта необходимо указать
                                    задание, для которого создается данный вариант, и имя варианта.</p>
                                    <p>Сохранение варианта недоступно в случае, если JSON-файл не валиден или не введено
                                    имя варианта. Все варианты по умолчанию создаются для модуля "Шаблон".</p>
                                    <p>Для генерации структуры по шаблону необходимо выбрать структуру из выпадающео списка,
                                    указать требуемые атрибуты и нажать кнопку "Генерировать структуру графа".</p>
                                    <p>Кнопка "Добавить еще одну структуру" позволяет добавить больше одной структуры-шаблона
                                    в JSON-файл. Для этого надо так же выбрать структуры и атрибуты. Добавление
                                    еще одной структуры для невалидного JSON-файла недоступно.</p>
                                </div>
                            </div>
                        </TabPane>
                    </TabContent>
                </Col>
                <Col sm={{size: 2,
                    offset: 1
                }}>
                    <p style={{marginTop: "40px"}}>Выберите задание</p>
                    <ButtonDropdown isOpen={this.state.isDropdownOpen2} toggle={this.chooseModule}
                                    outline color="secondary" style={{marginRight: "0"}}>
                        <DropdownToggle outline color="secondary" className={"generate"} caret>
                            {(this.props.modules.find(m => m.id === this.state.moduleId) || {name: ""}).name}
                        </DropdownToggle>
                        <DropdownMenu>
                            {this.props.modules.map(m =>
                                <DropdownItem
                                    key={m.id}
                                    onClick={this.handleModuleDropdownClick(m.id)}
                                >
                                    {m.name}
                                </DropdownItem>)}
                        </DropdownMenu>
                    </ButtonDropdown>
                    <p>Введите имя варианта</p>
                    <Input className={"generate"} value={this.state.name} onChange={this.updateName}>Имя</Input>
                    <Button className={"generate"} onClick={this.saveVariant} disabled={!this.isJSONCorrect() || !this.state.name} outline
                            color="secondary">Сохранить</Button>
                </Col>
                <Col sm={{size: 2,
                    offset: 1
                }}>
                    <p style={{marginTop: "40px"}}>Сгенерировать структуру по шаблону</p>
                    <ButtonDropdown isOpen={this.state.isDropdownOpen} toggle={this.handleDropdownToggle}>
                        <DropdownToggle outline color="secondary" className={"generate"} caret>
                            {this.state.currentDropdownOption}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={this.getOptionHandler({
                                label1: "Количество вершин",
                                label2: "Количество ребер",
                                structButton: "Генерировать структуру графа"
                            }, "graphV", "Граф с обозначением вершин")}>Граф с обозначением вершин</DropdownItem>
                            <DropdownItem onClick={this.getOptionHandler({
                                label1: "Количество вершин",
                                label2: "Количество ребер",
                                structButton: "Генерировать структуру графа"
                            }, "graphVE", "Граф с обозначением и вершин, и ребер")}>Граф с обозначением и вершин, и
                                ребер</DropdownItem>
                            <DropdownItem onClick={this.getOptionHandler({
                                label1: "Количество строк",
                                label2: "Количество столбцов",
                                structButton: "Генерировать структуру матрицы"
                            }, "matrix", "Матрица")}>Матрица</DropdownItem>
                        </DropdownMenu>
                    </ButtonDropdown>
                    <div>
                        <p>{this.state.labels.label1}</p>
                        <Input className={"generate"} type={"number"} defaultValue="5" onChange={this.updateVertex}>Количество
                            вершин</Input>
                        <p>{this.state.labels.label2}</p>
                        <Input className={"generate"} type={"number"} defaultValue="6" onChange={this.updateEdge}>Количество
                            ребер</Input>
                        <Button className={"generate"} onClick={this.handleButtonClick} outline
                                color="secondary">{this.state.labels.structButton}</Button>
                        <Button className={"generate"} disabled={!this.isJSONCorrect()}
                            onClick={this.handleAddButtonClick} outline color="secondary">
                            Добавить еще одну структуру
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    }

    /**
     * Обновление имени варианта
     * @param event
     */
    private updateName(event: any) {
        this.setState({
            name: event.target.value
        })
    }

    /**
     * Сохранение варианта, переход на страницу просмотра вариантов
     */
    private saveVariant() {
        this.props.saveVariant(this.state.value, this.state.name, this.state.moduleId.toString(), this.props.match.params.id);
        alert("Вариант \"" + this.state.name + "\" сохранен!")
        if (!this.props.match.params.id) {
            this.props.getVariants();
            this.props.history.push(`/variants`);
        }
    }

    /**
     * Открытие списка модулей
     */
    private chooseModule() {
        this.setState({
            isDropdownOpen2: !this.state.isDropdownOpen2
        })
    }

    /**
     * Выбор модуля для варианта
     */
    private handleModuleDropdownClick(id: number) {
        return () => {
            this.setState({
                moduleId: id
            })
        }
    }

    /**
     * Выбор вкладки редактора
     * @param id
     */
    private triggerTab(id: string) {
        return (() => {
            this.setState({
                tabIndex: id
            })
        });
    }

    private getOptionHandler(labels: State['labels'], structToGenerate: State['structToGenerate'], currentDropdownOption: string) {
        return (() => {
            this.setState({
                labels,
                structToGenerate,
                currentDropdownOption
            })
        })
    }

    private handleAddButtonClick() {
        this.handleChange(this.state.value.replace(/]$/, `,\n${this.getJSON(this.state.structToGenerate, this.state.vertexAmount, this.state.edgesAmount)}]`))
    }

    private handleDropdownToggle() {
        this.setState({
            isDropdownOpen: !this.state.isDropdownOpen
        })
    }

    private handleButtonClick() {
        this.handleChange(`[${this.getJSON(this.state.structToGenerate, this.state.vertexAmount, this.state.edgesAmount)}]`);
    }

    private getJSON(structToGenerate: string, vertexAmount: number, edgesAmount: number) {
        switch (structToGenerate) {
            case "graphV": {
                const vertices = Array.from(Array(vertexAmount).keys())
                    .map(e => `"${e}"`)
                    .join(",");
                const edges = Array.from(Array(edgesAmount))
                    .map(() => `{ "sources": "sourceName" , "target": "targetName" }`)
                    .join(",\n\t");
                return `{ "type": "graph", "value": {\n` +
                    `\t"vertices": [${vertices}], \n` +
                    `\t"edges": \n` +
                    `\t[${edges}] \n` +
                    `   } \n` +
                    `}`;
            }
            case "graphVE": {
                const vertices = Array.from(Array(vertexAmount).keys())
                    .map(e => `"${e}"`)
                    .join(",");
                const edges = Array.from(Array(edgesAmount).keys())
                    .map(e => `{ "name": "${e}", "sources": "sourceName" , "target": "targetName" }`)
                    .join(",\n\t");
                return `{ "type": "graph", "value": {\n` +
                    `\t"vertices": [${vertices}], \n` +
                    `\t"edges": \n` +
                    `\t[${edges}] \n` +
                    `   } \n` +
                    `}`;
            }
            case "matrix": {
                const rows = Array.from(Array(vertexAmount).keys())
                    .map(e => `"${e}"`)
                    .join(",");
                const cols = Array.from(Array(edgesAmount).keys())
                    .map(e => `"${e}"`)
                    .join(",");
                const line = Array.from(Array(edgesAmount).keys())
                    .map(e => `"${e}"`)
                    .join(",");
                const matrix = Array.from(Array(vertexAmount))
                    .map(() => `{${line}}`)
                    .join(",\n\t");
                return `{ "type": "matrix", "value": {\n` +
                    `\t"rows": [${rows}], \n` +
                    `\t"columns": [${cols}], \n` +
                    `\t"elements":\n\t [${matrix}] \n` +
                    `}`;
            }
            default: {
                return "Здесь еще ничего нет";
            }
        }
    }

    private updateVertex(event: any) {
        this.setState({
            vertexAmount: parseInt(event.target.value, 10)
        })
    }

    private updateEdge(event: any) {
        this.setState({
            edgesAmount: parseInt(event.target.value, 10)
        })
    }

    private handleChange(value: string) {
        this.setState({
            value
        })
    }

    private isJSONCorrect() {
        try {
            JSON.parse(this.state.value);
            return true;
        } catch (e) {
            return false;
        }
    }
}

const mapStateToProps = (state: RootState, props: any) => {
    return {
        variant: (state.variants.data || []).find(e => e.id === parseInt(props.match.params.id, 10)),
        modules: state.modules.data
    };
};

const mapDispatchToProps = {
    getVariants: actions.getVariants,
    getModules: actions.getModules,
    saveVariant: actions.saveVariant
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(VariantEditor));