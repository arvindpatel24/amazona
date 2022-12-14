import axios from "axios";
import { useContext, useEffect, useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Rating from "../components/Rating";
import {Helmet} from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";

const reducer = (state, action) => {
  console.log("Reducer");
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
};

function Product () {
    const navigate = useNavigate();
    const parms = useParams();
    const {slug} = parms;
    const [{ loading, error, product }, dispatch] = useReducer(reducer, {
        loading: false,
        error: "",
        product: {},
    });
    useEffect(() => {
        const fetchdata = async () => {
        dispatch({ type: "FETCH_REQUEST" });
        try {
            const result = await axios.get(`/api/product/slug/${slug}`);
            console.log(`For ${slug}`, result);
            dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        } catch (error) {
            dispatch({ type: "FETCH_FAIL", error: getError(error) });
        }
        };
        fetchdata();
    }, [slug]);

    const {state, dispatch: ctxDispatch} = useContext(Store);
    const {cart} = state;
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await axios.get(`/api/product/${product._id}`)
        if(data.countInStock < quantity) {
            window.alert('Sorry. Product is out of Stock');
            return;
        }
        ctxDispatch({type:'CART_ADD_ITEM', payload: {...product, quantity}})
        navigate('/cart');
    }
    return (
        loading ? <LoadingBox/> :
        error   ? <MessageBox variant="danger">{error}</MessageBox> :
        (<div>
           <Row>
                <Col md={6}>
                    <img className="img-large" src={product.image} alt={product.name}></img>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Helmet><title>{product.name}</title></Helmet>
                            <h1>{product.name}</h1>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating rating={product.rating} numReviews={product.numReviews} />
                        </ListGroup.Item>
                        <ListGroup.Item>Price : {product.price}</ListGroup.Item>
                        <ListGroup.Item>Description : {product.description}</ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>${product.price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.countInStock > 0 ?
                                                <Badge bg="success">In Stock</Badge> :
                                                <Badge bg="danger">Unavailable</Badge>
                                            }
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {product.countInStock > 0 && 
                                    <ListGroup.Item>
                                        <div className="d-grid">
                                            <Button onClick={addToCartHandler} variant="primary">
                                                Add to Cart
                                            </Button>

                                        </div>
                                    </ListGroup.Item>

                                }
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row> 
        </div>)
    );
}


export default Product;