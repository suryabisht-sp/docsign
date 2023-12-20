/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { ToastContainer, toast } from 'react-toastify';
import OAuthImplicit from './OAuthImplicit';
import DocuSign from './DocuSign';
import './App.css';
import Modal from 'react-bootstrap/Modal';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accessToken: undefined,
            expires: undefined,
            name: undefined,
            email: undefined,
            externalAccountId: undefined,
            accountName: undefined,
            accountId: undefined,
            baseUri: undefined,
            page: 'welcome', // initial page. Pages: welcome|loggedIn
            working: false,
            workingMessage: '',
            responseErrorMsg: undefined,
            responseEnvelopeId: undefined,
            responseAvailableApiRequests: undefined,
            responseApiRequestsReset: undefined,
            responseSuccess: undefined,
            responseTraceId: undefined,
            resultsEnvelopeJson: undefined,
            formName: '',
            formEmail: '',
            selectedFile: null,
            errorMessage: '',
            pdfBlobs: null,
            namedBlobs: [],
            selectedPdfIndex: null,
            selectedPdfPreviewIndex: null,
            showModal: false,
        };
        this.oAuthImplicit = new OAuthImplicit(this);
        this.docusign = new DocuSign(this);
        // bind <this> for methods called by React via buttons, etc
        this.logout = this.logout.bind(this);
        this.startAuthentication = this.startAuthentication.bind(this);
        this.formNameChange = this.formNameChange.bind(this);
        this.formEmailChange = this.formEmailChange.bind(this);
        this.sendEnvelope = this.sendEnvelope.bind(this);
        this.getEnvelope = this.getEnvelope.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
    }

    handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        console.log("slecgted fiels", selectedFiles)
        const validFiles = Array.from(selectedFiles).filter(file => file.type === 'application/pdf');

        if (validFiles.length > 0) {
            this.setState({
                selectedFiles: validFiles,
                errorMessage: '',
            });

            // Convert each selected file to a blob
            validFiles.forEach(file => this.convertToBlob(file));
        } else {
            this.setState({
                selectedFiles: [],
                errorMessage: 'Please select one or more valid PDF files.',
                selectedPdfIndex: null,
            });
        }
    };

    clearState = (index) => {
        console.log("index for clear", index)
        this.setState((prevState) => ({
            pdfBlobs: prevState.pdfBlobs.filter((_, i) => i !== index),
            selectedPdfIndex: null
        }));
    };

    convertToBlob = (file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const pdfBlob = new Blob([reader.result], { type: 'application/pdf' });
            const namedBlob = {
                name: file.name,
                blob: pdfBlob,
            };

            // Update the state to include the new namedBlob
            this.setState((prevState) => ({
                pdfBlobs: [...(prevState.pdfBlobs || []), namedBlob],  // Change here
            }));
        };

        reader.readAsArrayBuffer(file);
    };

    showPreviewModal = (index) => {
        this.setState({ showModal: true, selectedPdfPreviewIndex: index });
    };

    hidePreviewModal = () => {
        this.setState({ showModal: false, selectedPdfPreviewIndex: null });
    };

    /**
     * Starting up--if our URL includes a hash, check it to see if 
     * it's the OAuth response
     */
    async componentDidMount() {
        const config = window.config;
        // if the url has a query parameter of ?error=logout_request (from a logout operation) 
        // then remove it
        if (window.location.search && window.location.search === '?error=logout_request') {
            window.history.replaceState(null, '', config.DS_APP_URL);
        }

        if (config?.DS_REDIRECT_AUTHENTICATION) {
            const hash = window.location.hash;
            if (!hash) { return }
            // possible OAuth response
            this.setState({ working: true, workingMessage: 'Logging in' });
            var scopeValue = hash.match(/scope=([^&]+)/)[1];

            // Decode the URL-encoded string and replace space with hyphen
            var newScopeValue = decodeURIComponent(scopeValue).replace(/%20/g, "-");

            // Replace the old scope value with the new one
            var newhash = hash.replace(/scope=([^&]+)/, "scope=" + encodeURIComponent(newScopeValue));
            await this.oAuthImplicit.receiveHash(newhash);
            this.setState({ working: false });
        } else {
            // await authentication via the new tab
            window.addEventListener("message", this.receiveMessage, false);
        }
    }

    /**
     * Receive message from a child .
     * This method is only used if authentication is done
     * in a new tab. See file public/oauthResponse.html 
     * @param {object} e 
     */
    async receiveMessage(e) {
        console.log("e data", e)
        const rawSource = e && e.data && e.data.source
            , ignore = {
                'react-devtools-inject-backend': true,
                'react-devtools-content-script': true,
                'react-devtools-detector': true,
                'react-devtools-bridge': true
            }
            , source = (rawSource && !ignore[rawSource]) ? rawSource : false
            ;
        if (!source) { return }; // Ignore if no source field
        if (source === 'oauthResponse') {
            this.setState({ working: true, workingMessage: 'Logging in' });
            const hash = e.data && e.data.hash;
            await this.oAuthImplicit.receiveHash(hash);
            this.setState({ working: false });
        }
    }

    startAuthentication() {
        this.oAuthImplicit.startLogin();
    }

    /**
     * Is the accessToken ok to use?
     * @returns boolean accessTokenIsGood
     */
    checkToken() {
        if (
            !this.state.accessToken ||
            this.state.expires === undefined ||
            new Date() > this.state.expires
        ) {
            // Need new login. Only clear auth, don't clear the state (leave form contents);
            this.clearAuth();
            this.setState({ page: 'welcome', working: false });
            toast.error('Your login session has ended.\nPlease login again', {
                autoClose: 8000,
            });
            return false;
        }
        return true;
    }

    /**
     * This method clears this app's authentication information.
     * But there may still be an active login session cookie
     * from the IdP. Your IdP may have an API method for clearing
     * the login session.
     */
    logout() {
        this.clearAuth();
        this.clearState();
        this.setState({ page: 'welcome' });
        toast.success('You have logged out.', { autoClose: 5000 });
        this.oAuthImplicit.logout();
    }

    /**
     * Clear authentication-related state
     */
    clearAuth() {
        this.setState({
            accessToken: undefined,
            expires: undefined,
            accountId: undefined,
            externalAccountId: undefined,
            accountName: undefined,
            baseUri: undefined,
            name: undefined,
            email: undefined,
        })
    }

    /**
     * Clear the app's form and related state
     */
    clearState() {
        this.setState({
            formName: '',
            formEmail: '',
            working: false,
            responseErrorMsg: undefined,
            responseEnvelopeId: undefined,
            responseAvailableApiRequests: undefined,
            responseApiRequestsReset: undefined,
            responseSuccess: undefined,
            responseTraceId: undefined,
            resultsEnvelopeJson: undefined,
        });
    }

    /**
     * Process the oauth results.
     * This method is called by the OAuthImplicit class
     * @param results
     */
    oAuthResults(results) {
        this.setState({
            accessToken: results.accessToken,
            expires: results.expires,
            name: results.name,
            externalAccountId: results.externalAccountId,
            email: results.email,
            accountId: results.accountId,
            accountName: results.accountName,
            baseUri: results.baseUri,
            page: 'loggedIn',
            formName: results.name, // default: set to logged in user
            formEmail: results.email,
        });
        toast.success(`Welcome ${results.name}, you are now logged in`);
    }

    formNameChange(event) {
        this.setState({ formName: event.target.value });
    }

    formEmailChange(event) {
        this.setState({ formEmail: event.target.value });
    }

    async sendEnvelope() {
        this.setState({
            responseErrorMsg: undefined,
            responseEnvelopeId: undefined,
            responseAvailableApiRequests: undefined,
            responseApiRequestsReset: undefined,
            responseSuccess: undefined,
            responseTraceId: undefined,
            resultsEnvelopeJson: undefined,
        });
        if (!this.checkToken()) {
            return; // Problem! The user needs to login
        }
        if (!this.state.formEmail || this.state.formEmail.length < 5) {
            toast.error("Problem: Enter the signer's email address");
            return;
        }
        if (!this.state.formName || this.state.formName.length < 5) {
            toast.error("Problem: Enter the signer's name");
            return;
        }
        this.setState({ working: true, workingMessage: "Sending envelope" });
        const results = await this.docusign.sendEnvelope(this.state.pdfBlobs[this.state.selectedPdfIndex].blob);
        const { apiRequestsReset } = results;
        const responseApiRequestsReset = apiRequestsReset ?
            new Date(apiRequestsReset) : undefined;
        this.setState({
            working: false,
            responseSuccess: results.success,
            responseErrorMsg: results.errorMsg,
            responseEnvelopeId: results.envelopeId,
            responseAvailableApiRequests: results.availableApiRequests,
            responseTraceId: results.traceId,
            responseApiRequestsReset,
        });
    }

    async getEnvelope() {
        this.setState({
            responseErrorMsg: undefined,
            responseEnvelopeId: undefined,
            responseAvailableApiRequests: undefined,
            responseApiRequestsReset: undefined,
            responseSuccess: undefined,
            responseTraceId: undefined,
        });
        if (!this.checkToken()) {
            return; // Problem! The user needs to login
        }
        if (!this.state.responseEnvelopeId) {
            toast.error("Problem: First send an envelope");
            return;
        }

        this.setState({ working: true, workingMessage: "Fetching the envelope's status" });
        const results = await this.docusign.getEnvelope();
        const { apiRequestsReset } = results;
        const responseApiRequestsReset = apiRequestsReset
            ? new Date(apiRequestsReset) : undefined;
        this.setState({
            working: false,
            responseSuccess: results.success,
            responseErrorMsg: results.errorMsg,
            responseAvailableApiRequests: results.availableApiRequests,
            responseTraceId: results.traceId,
            resultsEnvelopeJson: results.resultsEnvelopeJson,
            responseApiRequestsReset,
        });
    }

    /**
     * Render this component
     */
    render() {
        // Just two pages with a common header. 
        // Choose the body of the page:
        let pagebody;
        switch (this.state.page) {
            case 'welcome': // not logged in
                pagebody = this.Welcome();
                break;
            case 'loggedIn':
                pagebody = this.LoggedIn();
                break;
            default:
                pagebody = this.Welcome();
        };

        // Compute the name block for the top nav section
        let nameBlock;
        if (this.state.accessToken) {
            nameBlock = (
                <Navbar.Text>
                    {this.state.name}<br />
                    {this.state.accountName} ({this.state.accountId})
                    <Nav>
                        <Nav.Link href="#" onClick={() => this.logout()}>Logout</Nav.Link>
                    </Nav>
                </Navbar.Text>
            )
        } else {
            nameBlock = null;
        }

        // The spinner
        const spinner = (
            <Container fluid className='bodyMargin'
                style={{ display: this.state.working ? 'block' : 'none' }}>
                <Row className='justify-content-center'>
                    <div className="spinner" />
                </Row>
                <Row className='justify-content-center'>
                    <h3>{this.state.workingMessage}…</h3>
                </Row>
            </Container>
        )

        // The complete page:
        return (
            <>
                <Navbar fixed="top" bg="primary" variant="dark" >
                    <Navbar.Brand>DocuSign Code Example</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">{nameBlock}</Navbar.Collapse>
                </Navbar>
                <ToastContainer />
                {spinner}
                {pagebody}
            </>
        )
    }

    LoggedIn() {
        const resetTime = this.state.responseApiRequestsReset;
        const resetTimeString = resetTime
            ? new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'full',
            }).format(resetTime)
            : undefined;
        return (
            <Container className='bodyMargin'>
                <Row>
                    <Col className="col-md-4">
                        <h2>Send an Envelope</h2>
                        <Form>
                            <Form.Group controlId="formName">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" placeholder="Name"
                                    value={this.state.formName}
                                    onChange={this.formNameChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Email"
                                    value={this.state.formEmail}
                                    onChange={this.formEmailChange}
                                />
                            </Form.Group>
                            <Form.Group>
                                <label htmlFor="pdfFile">Choose a PDF file:</label>
                                <br />
                                <Form.Group className="custom-file">
                                    <input
                                        type="file"
                                        className="custom-file-input"
                                        id="pdfFile"
                                        accept=".pdf"
                                        onChange={this.handleFileChange}
                                        multiple
                                    />

                                    <label className="custom-file-label" htmlFor="pdfFile">
                                        {this.state.selectedFile ? this.state.selectedFile.name : 'Choose file...'}
                                    </label>
                                </Form.Group>
                                {this.state.errorMessage && (
                                    <div className="text-danger">{this.state.errorMessage}</div>
                                )}
                            </Form.Group >
                            <Button variant="primary" onClick={this.sendEnvelope}>
                                Send Envelope
                            </Button>
                            <Button variant="primary" className='ml-4' onClick={this.getEnvelope}>
                                Get Envelope Status
                            </Button>
                            <br />
                        </Form>

                    </Col>
                    {this.state.pdfBlobs?.length <= 2 && <div className='pdf-list'>
                        {this.state.pdfBlobs?.length > 0 && this.state.pdfBlobs.map((namedBlob, index) => (
                            <div style={{ width: this.state.pdfBlobs?.length < 5 ? "25%" : "100%" }} className={`mt-3 card-list ${index === this.state.selectedPdfIndex ? 'highlight-pdf' : ''}`} key={index} onClick={() => this.setState({ selectedPdfIndex: index })}>
                                <div className="input-group-append btn-dir">
                                    <Button
                                        type="button"
                                        variant="red"
                                        className="close"
                                        aria-label="Close"
                                        onClick={() => this.clearState(index)}
                                    >
                                        <span aria-hidden="true" className='btn-dir1'>&times;</span>
                                    </Button>
                                </div>
                                <Form.Group className='pdf-algn' style={{ width: this.state.pdfBlobs?.length < 3 ? "50%" : "100%" }}>
                                    <img
                                        className='card-body'
                                        title="PDF Preview"
                                        width="100%"
                                        height="auto"
                                        src='https://static.vecteezy.com/system/resources/previews/010/750/673/non_2x/pdf-icon-on-white-background-file-pdf-icon-sign-pdf-format-symbol-flat-style-free-vector.jpg'
                                    // src={URL.createObjectURL(namedBlob.blob)}
                                    />
                                    <p className={`text-alg ${index === this.state.selectedPdfIndex ? 'highlight-text' : ''}`}>
                                        {namedBlob.name}</p>
                                </Form.Group>
                                {this.state.pdfBlobs?.length > 0 && this.state.selectedPdfIndex !== null ? <Button onClick={() => this.showPreviewModal(this.state.selectedPdfIndex)}>Preview</Button> : ""}
                            </div>
                        ))}
                    </div>}
                    <Modal show={this.state.showModal} onHide={this.hidePreviewModal} style={{ height: "100vh" }}>
                        <Modal.Header closeButton>
                            <Modal.Title>PDF Preview</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.pdfBlobs && this.state.selectedPdfPreviewIndex !== null && (
                                <iframe
                                    className='modal-pdf-preview'
                                    title="PDF Preview"
                                    width="100%"
                                    height="auto"
                                    src={URL.createObjectURL(this.state.pdfBlobs[this.state.selectedPdfPreviewIndex].blob)}
                                />
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.hidePreviewModal}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Row>
                {this.state.pdfBlobs?.length > 2 && <table class="table common">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No</th>
                            <th scope="col">File Name</th>
                            <th scope="col">Select</th>
                            <th scope="col">Image</th>
                        </tr>
                    </thead>

                    {this.state.pdfBlobs.map((namedBlob, index) => (
                        <tbody>
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{namedBlob.name}</td>
                                <td><input type='radio'
                                    name='selectedPdf'
                                    checked={index === this.state.selectedPdfIndex}
                                    onChange={() => this.setState({ selectedPdfIndex: index })} />
                                    <Button onClick={() => this.showPreviewModal(index)} className='ml-1'>Preview</Button>
                                </td>
                                <td> <img
                                    className='card-body'
                                    title="PDF Preview"
                                    width="30px"
                                    style={{ padding: "0" }}
                                    height="40px"
                                    src='https://static.vecteezy.com/system/resources/previews/010/750/673/non_2x/pdf-icon-on-white-background-file-pdf-icon-sign-pdf-format-symbol-flat-style-free-vector.jpg'
                                /></td>
                            </tr>
                        </tbody>
                    ))}

                </table>}
                <Row className='mt-4'>
                    <Col>
                        <h2>Results</h2>
                        <h2>
                            {this.state.responseSuccess !== undefined ? (
                                this.state.responseSuccess ? (
                                    <>
                                        {this.setState({
                                            responseSuccess: undefined,
                                        })}
                                        ✅ Success!</>
                                ) : (
                                    <>❌ Problem!</>
                                )
                            ) : null}
                        </h2>
                        {this.state.responseSuccess !== undefined && toast.success(`Document sent successfully to ${this.state.formEmail}`, { autoClose: 4000 })}
                        {this.state.responseErrorMsg ? (
                            <p>Error message: {this.state.responseErrorMsg}</p>
                        ) : null}
                        {this.state.responseEnvelopeId ? (
                            <p>Envelope ID: {this.state.responseEnvelopeId}</p>
                        ) : null}
                        {this.state.resultsEnvelopeJson ? (
                            <p><pre>Response: {JSON.stringify(this.state.resultsEnvelopeJson, null, 4)}</pre></p>
                        ) : null}
                        {this.state.responseAvailableApiRequests ? (
                            <p>
                                Available API requests: {this.state.responseAvailableApiRequests}
                            </p>
                        ) : null}
                        {resetTimeString ? (
                            <p>API requests reset time: {resetTimeString}</p>
                        ) : null}
                        {this.state.responseTraceId ? (
                            <p>
                                Trace ID: {this.state.responseTraceId}. Please include with all
                                customer service questions.
                            </p>
                        ) : null}
                    </Col>
                </Row>
            </Container>
        )
    }

    Welcome() {
        return (
            <Container fluid className='welcomeMargin'>
                <Row>
                    <Col>
                        <Jumbotron>
                            <h1>React Example with OAuth Authentication</h1>
                            <p>
                                OAuth Implicit grant flow.
                            </p>
                            <p>
                                A better Way to Do signature.
                            </p>
                            <p>
                                Login with your DocuSign Developer (Demo) credentials.
                            </p>
                            <p>
                                <Button variant="primary" onClick={this.startAuthentication}>Login</Button>
                            </p>
                        </Jumbotron>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default App;