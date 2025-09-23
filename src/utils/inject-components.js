import {
  Button,
  Table,
  Row,
  Col,
  Select,
  Form,
  FormItem,
  Option,
  Input,
  Image,
  Spin,
  Tabs,
  TabPane,
  Exception,
  Divider,
  Modal,
  Icon,
  Tag,
  Card,
  PageHeader,
  Circle,
  Page,
  Tooltip,
  Poptip,
  Radio,
  RadioGroup,
  DatePicker,
  Collapse,
  Panel
} from 'view-ui-plus';

import {
  ScrollTop,
  Anchor,
  AnchorLink,
  Consult,
  Empty,
  PageLoading,
  TableImage,
  ItemDetailModal,
  BoardRank
} from '@/components';
import 'view-ui-plus/dist/styles/viewuiplus.css';

const componentMap = {
  Input,
  Button,
  Table,
  Row,
  Col,
  Select,
  Option,
  Form,
  FormItem,
  Image,
  Spin,
  Tabs,
  TabPane,
  Exception,
  Divider,
  Modal,
  Card,
  Tag,
  PageHeader,
  Icon,
  Circle,
  Page,
  Tooltip,
  Anchor,
  Radio,
  RadioGroup,
  DatePicker,
  ScrollTop,
  AnchorLink,
  Collapse,
  Panel,
  Consult,
  Empty,
  PageLoading,
  TableImage,
  ItemDetailModal,
  BoardRank,
  Poptip
};

const injectComponents = app => {
  for (const [componentName, componentInstance] of Object.entries(componentMap)) {
    app.component(componentName, componentInstance);
  }
};

export default injectComponents;
