import sys
from pathlib import Path
from io import BytesIO
from flask import Flask, render_template, send_file
import webview

# 窗口相关设置
width = 1500
height = 800
min_width = 790
min_height = 630

music_directory: list = [Path.home() / "Music"]
audio_files_info_dict = {}
app = Flask(
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="",
)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/adindex.html")
def adindex_html():
    return render_template("adindex.html")


@app.route("/pcindex.html")
def pcindex_html():
    return render_template("pcindex.html")


@app.route("/sounds/<music_name>")
def play_music(music_name):
    return send_file(audio_files_info_dict[music_name])


@app.route("/list.txt")
def music_list():
    global audio_files_info_dict
    audio_files_info_dict = get_audio_file_dict(music_directory)
    musics_name = get_audio_file_names(audio_files_info_dict)
    buffer = BytesIO()
    buffer.write(musics_name.encode("utf-8"))
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name="list.txt")


def get_audio_file_names(musics_info: dict):
    return "\n".join(list(musics_info.keys()))


def get_audio_file_dict(directory_paths: list):
    """
    从多个目录中读取音频文件，并返回一个字典，将文件名映射到其绝对路径。

    Args:
        directory_paths (list): 目录路径的列表。

    Returns:
        dict: 一个字典，其中键是文件名，值是绝对文件路径。
    """
    audio_files_dict = {}  # 创建一个空字典来存储文件名和绝对路径
    audio_extensions = (".mp3", ".wav", ".flac", ".ogg", ".m4a", ".aac", ".wma", ".ape")

    for directory_path in directory_paths:
        path = Path(directory_path)
        for file_path in path.rglob("*"):
            if file_path.suffix.lower() in audio_extensions:
                audio_files_dict[file_path.name] = str(file_path.resolve())

    return audio_files_dict


# js交互py的api
class pyApi:

    def window_resizeTo(self, newWidth, newHeight):
        window.resize(newWidth, newHeight)

    def window_move(self, width, height):
        window.move(width, height)

    def window_resize(self, width, height):
        window.resize(width, height)

    def window_resize_to_default(self):
        window.resize(width, height)

    def window_size(self):
        return window.width, window.height

    def window_location(self):
        return window.x, window.y

    def minimize(self):
        window.maximized = False
        window.minimized = True
        window.minimize()

    def isMinimize(self):
        return window.minimized

    def maximize(self):
        window.maximized = True
        window.minimized = False
        window.maximize()

    def isMaximized(self):
        return window.maximized

    def restore(self):
        window.maximized = False
        window.minimized = False
        window.restore()
        if window.y < 0:
            window.move(window.x, 0)

    def close(self):
        window.destroy()


# 窗口状态更新
def on_maximized():
    window.maximized = True
    window.minimized = False


def on_minimized():
    window.maximized = False
    window.minimized = True


def on_resized(width, height):
    # print(f'窗口已调整大小，新尺寸为 {width} x {height}')
    pass


def on_moved(x, y):
    pass


def on_restored():
    # 窗口从最大化或最小化状态还原时触发。
    if window.maximized and not window.minimized:
        # 最大化还原到窗口
        window.maximized = False
        window.minimized = False
    elif not window.maximized and window.minimized:
        # 最小化还原到窗口
        window.maximized = False
        window.minimized = False
    elif window.maximized and window.minimized:
        # 最小化还原到最大化
        window.maximized = True
        window.minimized = False


def on_closed():
    # print('窗口已关闭')
    pass


# 窗口控制器
def evaluate_js(window):
    result = window.evaluate_js(
        r"""
window.addEventListener('DOMContentLoaded', function () {
    const JSElement = document.createElement("script");
    JSElement.setAttribute("type", "text/javascript");
    JSElement.setAttribute("src", "js/titleBarInit.js");
    JSElement.classList.add('pywebview-drag-region');
    document.body.appendChild(JSElement);
});


"""
    )


api = pyApi()
window = webview.create_window(
    "html-music-player",
    app,
    width=width,
    height=height,
    min_size=(min_width, min_height),
    resizable=True,
    frameless=True,
    easy_drag=False,
    js_api=api,
)

# 监听窗口控件
window.events.closed += on_closed
window.events.maximized += on_maximized
window.events.minimized += on_minimized
window.events.resized += on_resized
window.events.restored += on_restored
window.events.moved += on_moved


def main():
    # 在前端的页面中绘制自定义按钮，并绑定事件
    webview.start(
        evaluate_js,
        window,
        # debug=True,
    )
    sys.exit()


if __name__ == "__main__":
    main()
