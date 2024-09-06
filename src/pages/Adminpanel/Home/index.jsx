import React from 'react';
import {Col, Row} from "react-bootstrap";
import ContentAdmin from "../../../components/Adminpanel/Content";
import Header from "../../../components/Header";

export default function AdminHome(props) {
    return (
        <>
            <Header />
            <ContentAdmin />
        </>
    );
}
