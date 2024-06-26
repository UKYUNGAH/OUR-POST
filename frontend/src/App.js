import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Routes, Route, useParams } from 'react-router-dom';
import {
    SetOn,
    SetCategory,
    fetchPosts,
    fetchPostsByCategory,
    createPost,
    fetchDetail,
    verifyPassword,
    resetPasswordVerification,
    deletePost,
} from './store';
import { useState, useEffect } from 'react';
import { formatDate } from './formatDate';

function App() {
    return (
        <div className="App">
            <div className="wrap">
                <Header />
                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/post1" element={<Post1 />} />
                        <Route path="/post2" element={<Post2 />} />
                        <Route path="/write" element={<Write />} />
                        <Route path="/detail/:id" element={<Detail />}></Route>
                    </Routes>
                </div>
            </div>
        </div>
    );
}

function Header() {
    const on = useSelector((state) => state.on);
    const dispatch = useDispatch();

    return (
        <header className="header">
            <h1 className="logo">
                <Link to="/">Our Life</Link>
            </h1>

            <h2 className="sub_name">DASHBOARD</h2>
            <nav>
                <h3>
                    <Link
                        to="/"
                        className={on === 'ALL POSTS' ? 'active' : ''}
                        onClick={() => {
                            dispatch(SetOn('ALL POSTS'));
                        }}
                    >
                        ALL POSTS
                    </Link>
                    <Link
                        to="/post1"
                        className={on === 'BOARD' ? 'active' : ''}
                        onClick={() => {
                            dispatch(SetOn('BOARD'));
                        }}
                    >
                        BOARD
                    </Link>
                    <Link
                        to="/post2"
                        className={on === 'gallery' ? 'active' : ''}
                        onClick={() => {
                            dispatch(SetOn('gallery'));
                        }}
                    >
                        GALLERY
                    </Link>
                </h3>
            </nav>
        </header>
    );
}

function Home() {
    return <AllList />;
}

function Post1() {
    return <List category="BOARD" />;
}

function Post2() {
    return <List category="GALLERY" />;
}

function AllList() {
    const posts = useSelector((state) => state.posts.items);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    return (
        <div className="list_wrap">
            <Link to="/write" className="write_btn">
                <button>글 작성</button>
            </Link>
            <ul>
                {posts.map((a, i) => (
                    <li className="li" key={i}>
                        <Link to={`/detail/${a._id}`} className="list_link">
                            <div className="lw_top">
                                <div className="category">{a.category}</div>
                                <div className="nick">{a.nickname}</div>
                            </div>
                            <div className="lw_bottom">
                                <div className="title">{a.title}</div>
                                <div className="date">{formatDate(a.createdAt)}</div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function List({ category }) {
    const posts = useSelector((state) => state.posts.items);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPostsByCategory(category));
    }, [dispatch, category]);

    console.log(posts);
    return (
        <div className="list_wrap">
            <Link to="/write" className="write_btn">
                <button>글 작성</button>
            </Link>
            <ul>
                {posts.map((a, i) => (
                    <li className="li" key={i}>
                        <Link to={`/detail/${a._id}`} className="list_link">
                            <div className="lw_top">
                                <div className="category">{a.category}</div>
                                <div className="nick">{a.nickname}</div>
                            </div>
                            <div className="lw_bottom">
                                <div className="title">{a.title}</div>
                                <div className="date">{formatDate(a.createdAt)}</div>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function List2() {
    return (
        <div>
            <ul>
                <li>
                    <div className="top">
                        <div className="img"></div>
                    </div>
                    <div className="bottom">
                        <h4>title</h4>
                        <h5>nickname</h5>
                        <h5>date</h5>
                    </div>
                </li>
            </ul>
        </div>
    );
}

function Write() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const category = useSelector((state) => state.category);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('nickname', nickname);
        formData.append('password', password);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await fetch('http://localhost:5001/api/post', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('업로드 성공!');
                // 업로드 성공 시 처리
            } else {
                console.log('업로드 실패!');
                // 업로드 실패 시 처리
            }
        } catch (error) {
            console.error('업로드 중 에러 발생:', error);
        }
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];

        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setImage(selectedFile);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
    };

    return (
        <div className="write">
            <form className="write_form" onSubmit={handleSubmit}>
                <div className="category">
                    <h3>게시판선택</h3>
                    <ul>
                        <li
                            className={category === 'BOARD' ? 'ck' : ''}
                            onClick={() => {
                                dispatch(SetCategory('BOARD'));
                            }}
                        >
                            BOARD
                        </li>
                        <li
                            className={category === 'GALLERY' ? 'ck' : ''}
                            onClick={() => {
                                dispatch(SetCategory('GALLERY'));
                            }}
                        >
                            GALLERY
                        </li>
                    </ul>
                </div>
                <div className="w_top">
                    <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="w_mid">
                    <div className="wm_top">
                        <input
                            type="text"
                            placeholder="닉네임"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="비밀번호"
                            required
                        />
                    </div>
                    <div className="p_box">
                        <p>*쉬운 비밀번호를 입력하면 타인의 수정, 삭제가 쉽습니다.</p>
                        <p>
                            *음란물, 차별, 비하, 혐오 및 초상권, 저작권 침해 게시물은 민, 형사상의 책임을 질 수
                            있습니다.
                        </p>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="내용을 입력하세요"
                    ></textarea>
                </div>
                <div className="w_bottom">
                    {!preview && (
                        <div className="upload">
                            <input
                                type="file"
                                id="file_upload"
                                name="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <label htmlFor="file_upload">
                                <em></em>파일첨부
                            </label>
                        </div>
                    )}
                    {preview && (
                        <div className="preview">
                            <img src={preview} alt="미리보기" className="up_img" />
                            <button type="button" className="delete_i" onClick={handleRemoveImage}>
                                <img src="/delete_i.png" alt="삭제하기" />
                            </button>
                        </div>
                    )}
                </div>
                <div className="save_box">
                    <Link to="/post1">
                        <button type="button" className="btn1">
                            취소
                        </button>
                    </Link>
                    <button type="submit" className="btn2">
                        저장
                    </button>
                </div>
            </form>
        </div>
    );
}

function Detail() {
    const { id } = useParams();
    const posts = useSelector((state) => state.posts.items);
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        dispatch(fetchDetail(id));
    }, [id, dispatch]);

    const post = posts.find((post) => post._id === id);

    return (
        <div className="detail">
            <div className="title">
                <div className="title_l">
                    <h2>{post?.title}</h2>
                </div>
                <div className="title_r">
                    <Link to="/" className="edit_btn">
                        수정
                    </Link>
                    <button
                        className="delete_btn"
                        onClick={() => {
                            setShowModal(true);
                        }}
                    >
                        삭제
                    </button>
                </div>
            </div>
            <div className="info">
                <h3>{post?.nickname}</h3>
                <h4>{formatDate(post?.createdAt)}</h4>
            </div>
            <div className="contents">
                <img src={post?.imageUrl} alt="" />
                <p>{post?.content}</p>
            </div>
            {showModal && <Modal onClose={() => setShowModal(false)} />}
        </div>
    );
}

function Modal({ onClose, postId }) {
    const { id } = useParams();
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const passwordVerified = useSelector((state) => state.posts.passwordVerified);
    const error = useSelector((state) => state.posts.error);

    useEffect(() => {
        dispatch(fetchDetail(postId));
    }, [postId, dispatch]);

    useEffect(() => {
        if (passwordVerified) {
            // 비밀번호 확인이 완료되면 삭제 실행
            dispatch(deletePost(postId));
        }
    }, [passwordVerified, dispatch, postId]);

    const handleVerifyPassword = () => {
        dispatch(verifyPassword({ id: postId, password }));
    };

    return (
        <div className="modal">
            <div className="modal_wrap">
                <h4>게시글의 비밀번호를 입력해주세요.</h4>
                <div className="input_box">
                    <input
                        type="password"
                        placeholder="비밀번호 입력"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="pw_ok" onClick={handleVerifyPassword}>
                        확인
                    </button>
                </div>
                {error && <p>* {error}</p>}
                <button className="ok_btn" disabled={!passwordVerified} onClick={onClose}>
                    닫기
                </button>
                <button className="c_btn" onClick={onClose}>
                    <img src="/close_i.png" alt="" />
                </button>
            </div>
        </div>
    );
}

export default App;
