/*
Copyright 2014 Antonis Tsiapaliokas <antonis.tsiapaliokas@kde.org>
Copyright 2014 Giorgos Tsiapaliokas <giorgos.tsiapaliokas@kde.org>

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License as
published by the Free Software Foundation; either version 2 of
the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

package main

import (
    "fmt"
    "net/http"
    "net/url"
    "io/ioutil"
    "flag"
    "github.com/qiniu/iconv"
    "net/http/cookiejar"
)

func main() {
    studentUserName := flag.String("username", "", "The username of the student")
    studentPassword := flag.String("password", "", "The password of the student")
    flag.Parse()

    fmt.Println(*studentUserName)
    fmt.Println(*studentPassword)

    data := url.Values{}
    data.Set("userName", *studentUserName)
    data.Add("pwd", *studentPassword)
    data.Add("loginTrue", "login")
    data.Add("submit1", "%C5%DF%F3%EF%E4%EF%F2")

    cookieJar, _ := cookiejar.New(nil)

    client := &http.Client{
        Jar: cookieJar,
    }

    client.Get("https://dionysos.teilar.gr/unistudent/studentMain.asp")

    resp, err := client.PostForm("https://dionysos.teilar.gr/unistudent/login.asp",
    data)

    if nil != err {
        fmt.Println("error happened getting the response", err)
        return
    }

    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if nil != err {
        //fmt.Println("error happened reading the body", err)
        return
    }

   cd, err := iconv.Open("utf-8", "windows-1253")

    if err != nil {
        //fmt.Println("iconv.Open failed!")
        //fmt.Println(err)
        return;
    }
    defer cd.Close()

    output := cd.ConvString(string(body))

    fmt.Println(output)
}

