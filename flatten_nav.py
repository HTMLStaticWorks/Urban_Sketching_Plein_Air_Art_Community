import os
from bs4 import BeautifulSoup

workspace = r'd:\OFFICE\LIVE\JUNE[16-06-26]\Urban Sketching & Plein Air Art Community'
files = [f for f in os.listdir(workspace) if f.endswith('.html')]

for file_name in files:
    file_path = os.path.join(workspace, file_name)
    with open(file_path, 'r', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')

    changed = False

    # 1. Desktop Nav
    desktop_nav = soup.find('ul', class_='navbar-nav mx-auto gap-1')
    if desktop_nav:
        dropdown = desktop_nav.find('li', class_='dropdown')
        if dropdown and dropdown.find('a', string=lambda s: s and 'Home' in s):
            # Create new Home
            li_home = soup.new_tag('li')
            li_home['class'] = ['nav-item']
            a_home = soup.new_tag('a', href='index.html')
            a_home['class'] = ['nav-link']
            if file_name == 'index.html':
                a_home['class'].append('active')
            a_home.string = 'Home'
            li_home.append(a_home)

            # Create new Home 2
            li_home2 = soup.new_tag('li')
            li_home2['class'] = ['nav-item']
            a_home2 = soup.new_tag('a', href='home-2.html')
            a_home2['class'] = ['nav-link']
            if file_name == 'home-2.html':
                a_home2['class'].append('active')
            a_home2.string = 'Home 2'
            li_home2.append(a_home2)

            dropdown.replace_with(li_home)
            li_home.insert_after(li_home2)
            changed = True

    # 2. Mobile Nav
    mobile_nav = soup.find('ul', class_='navbar-nav gap-2')
    if mobile_nav:
        # The mobile nav dropdown doesn't have 'dropdown' class, it has data-bs-toggle="collapse"
        mobile_dropdown_a = mobile_nav.find('a', attrs={'data-bs-toggle': 'collapse'})
        if mobile_dropdown_a and 'HOME' in mobile_dropdown_a.text.upper():
            mobile_li = mobile_dropdown_a.parent
            
            # Create new Home
            li_home_m = soup.new_tag('li')
            li_home_m['class'] = ['nav-item']
            a_home_m = soup.new_tag('a', href='index.html')
            a_home_m['class'] = ['nav-link']
            if file_name == 'index.html':
                a_home_m['class'].append('active')
            a_home_m.string = 'Home'
            li_home_m.append(a_home_m)

            # Create new Home 2
            li_home2_m = soup.new_tag('li')
            li_home2_m['class'] = ['nav-item']
            a_home2_m = soup.new_tag('a', href='home-2.html')
            a_home2_m['class'] = ['nav-link']
            if file_name == 'home-2.html':
                a_home2_m['class'].append('active')
            a_home2_m.string = 'Home 2'
            li_home2_m.append(a_home2_m)

            mobile_li.replace_with(li_home_m)
            li_home_m.insert_after(li_home2_m)
            changed = True

    if changed:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(str(soup))
        print(f"Updated nav in {file_name}")

print("Navigation update complete.")
