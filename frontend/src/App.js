import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import "./App.css";
import CheckUser from "./components/auth/CheckUser";
import Following from "./components/Following";
import Gossips from "./components/Gossips";
import Admin from "./components/Admin";
import Auth from "./components/auth";
import Notifications from "./components/Notifications";
import Spaces from "./components/Spaces";
import YourActivity from "./components/YourActivity";
import { login, logout, selectUser } from "./features/userSlice";
import { auth } from "./Firebase";
import GossipsNavbar from "./components/GossipsNavbar";
import YourActivitySidebar from "./components/YourActivitySidebar";
import EachQuestion from "./components/EachQuestion";
import EachSpace from "./components/EachSpace";
import YourActivityAnswers from "./components/YourActivityAnswers";
import FirstTimeLogin from "./components/FirstTimeLogin";
import EachUser from "./components/EachUser";
import RedeemShop from "./components/RedeemShop";
import ReferAndEarn from "./components/ReferAndEarn";
import EachProduct from "./components/EachProduct";
import UserRank from "./components/UserRank";
import YourOrders from "./components/YourOrders";
import Feed from "./components/Feed";
import ManageFeed from "./components/ManageFeed";
import ManageSpaces from "./components/ManageSpaces";
import ManageOrders from "./components/ManageOrders";
import ManageProducts from "./components/ManageProducts";
import EachUserQuestions from "./components/EachUserQuestions";
import EachUserAnswers from "./components/EachUserAnswers";
import Page404 from "./components/Page404";
import AccountSettings from "./components/AccountSettings";
import About from "./components/About";
import Terms from "./components/Terms";
import Privacy from "./components/Privacy";
import AcceptableUse from "./components/AcceptableUse";
import EachQuestionTemp from "./components/EachQuestionTemp";
import EachSpaceTemp from "./components/EachSpaceTemp";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoggedIn = CheckUser();

  const PrivateRoute = ({ component: Component, ...rest }) => {
    return (
      <Route
        {...rest}
        exact
        render={(props) =>
          isLoggedIn ? (
            <>
              <GossipsNavbar />
              <Component {...props} />
            </>
          ) : (
            <Redirect
              to={{
                pathname: "/auth",
                state: {
                  from: props.location,
                },
              }}
            />
          )
        }
      />
    );
  };

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/auth" component={Auth} />
          <Route exact path="/auth/referred-by/:username" component={Auth} />

          {/* <React.Fragment> */}
          {/* <div className="gossips"> */}
          {/* <div className="gossips_content"> */}
          {/* <div className="gossips_contents"> */}
          <PrivateRoute exact path="/" component={Gossips} />
          <PrivateRoute exact path="/admin" component={Admin}></PrivateRoute>
          <PrivateRoute
            exact
            path="/admin/manage-feed"
            component={ManageFeed}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/admin/manage-spaces"
            component={ManageSpaces}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/admin/manage-orders"
            component={ManageOrders}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/admin/manage-products"
            component={ManageProducts}
          ></PrivateRoute>

          <PrivateRoute exact path="/following" component={Following} />

          <PrivateRoute exact path="/activity" component={YourActivity} />
          <PrivateRoute
            exact
            path="/activity/your-answers"
            component={YourActivityAnswers}
          />
          <PrivateRoute exact path="/spaces" component={Spaces} />
          <PrivateRoute exact path="/notifications" component={Notifications} />
          <PrivateRoute
            exact
            path="/question/:slug"
            component={EachQuestionTemp}
          />
          <PrivateRoute exact path="/space/:slug" component={EachSpaceTemp} />
          <PrivateRoute
            exact
            path="/firstTimeLogin/"
            component={FirstTimeLogin}
          />
          <PrivateRoute
            exact
            path="/firstTimeLogin/referred-by/:username"
            component={FirstTimeLogin}
          />
          <PrivateRoute exact path="/user/:username" component={EachUser} />
          <PrivateRoute
            exact
            path="/user/:username/answers"
            component={EachUserAnswers}
          />

          <PrivateRoute exact path="/redeemShop/" component={RedeemShop} />
          <PrivateRoute
            exact
            path="/redeemShop/leaderboard"
            component={UserRank}
          />
          <PrivateRoute
            exact
            path="/redeemShop/your-orders"
            component={YourOrders}
          />
          <PrivateRoute exact path="/product/:slug" component={EachProduct} />
          <PrivateRoute
            exact
            path="/refer-and-earn/"
            component={ReferAndEarn}
          />
          <PrivateRoute
            exact
            path="/account-settings/"
            component={AccountSettings}
          />

          <PrivateRoute exact path="/about/" component={About} />

          <PrivateRoute exact path="/terms/" component={Terms} />

          <PrivateRoute exact path="/privacy/" component={Privacy} />

          <PrivateRoute
            exact
            path="/acceptable-use/"
            component={AcceptableUse}
          />

          <PrivateRoute exact path="/page-404/" component={Page404} />
          <PrivateRoute path="*" component={Page404} />

          {/* {user ? (
                    <CustomRoute exact path="/" component={Gossips} />
                    ) : (
                      <Route exact path="/auth" component={Auth} />
                    )} */}
          {/* </div> */}
          {/* </div> */}
          {/* </div> */}
          {/* <Redirect to="/page404" /> */}
          {/* <PrivateRoute path="" component={Page404} /> */}
          {/* </React.Fragment> */}
          {/* <Route exact path="*" component={Page404} /> */}
        </Switch>
      </Router>
      {/* {user ? <Gossips /> : <Auth /> */}
    </div>
  );
}

export default App;
